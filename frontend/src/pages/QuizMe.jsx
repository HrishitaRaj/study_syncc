import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUpload, 
  FaSpinner, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaArrowRight, 
  FaRedo, 
  FaRegFileAlt,
  FaArrowLeft,
  FaRegLightbulb,
  FaRegStar,
  FaStar
} from 'react-icons/fa';
// Import the Google Generative AI SDK at the top of your file
import { GoogleGenerativeAI } from "@google/generative-ai";
import Navbar from '../components/Navbar'; // Import the Navbar component

const QuizMe = () => {
  // State management
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quizGenerated, setQuizGenerated] = useState(false);
  const [quizType, setQuizType] = useState('mcq');
  const [difficulty, setDifficulty] = useState('moderate');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [confidenceRatings, setConfidenceRatings] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  const [showHint, setShowHint] = useState(false);
  
  const fileInputRef = useRef(null);

  // Initialize the API with your API key
  const genAI = new GoogleGenerativeAI("AIzaSyDWgLtneFAMK83a7ZdulhCzQZyEfgOAEps");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const slideVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { x: -300, opacity: 0, transition: { duration: 0.2 } }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target.result);
      };
      reader.readAsText(selectedFile);
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Format Gemini API response into questions format used by the app
  const formatGeminiResponse = (parsedQuestions, type) => {
    try {
      // Create properly formatted questions based on quiz type
      switch(type) {
        case 'mcq':
          return parsedQuestions.map((q, index) => ({
            id: index + 1,
            question: q.question,
            options: q.options.map((option, i) => ({
              id: ['A', 'B', 'C', 'D'][i],
              text: option
            })),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || "No explanation provided",
            hint: q.hint || "Think carefully about the subject material."
          }));
          
        case 'tf':
          return parsedQuestions.map((q, index) => ({
            id: index + 1,
            question: q.question,
            correctAnswer: q.correctAnswer === "True" || q.correctAnswer === true,
            explanation: q.explanation || "No explanation provided",
            hint: q.hint || "Consider whether this statement aligns with the facts."
          }));
          
        case 'fitb':
          return parsedQuestions.map((q, index) => ({
            id: index + 1,
            question: q.question,
            correctAnswer: q.answer,
            explanation: q.explanation || "No explanation provided",
            hint: q.hint || "Try to recall the key term from your notes."
          }));
          
        default:
          throw new Error("Invalid quiz type");
      }
    } catch (error) {
      console.error("Error formatting Gemini response:", error);
      // If formatting fails, return mock questions as a fallback
      return generateMockQuestions(type, "moderate");
    }
  };

  // Function to generate quiz using Gemini API
  const generateQuiz = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Format the prompt based on quiz type and difficulty
      const prompt = formatPromptForGemini(fileContent, quizType, difficulty);
      console.log("Sending prompt to Gemini:", prompt);
      
      // Create a model instance
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // For testing - use mock data until API is working
      // This will ensure the app functions even if API has issues
      const mockQuestions = generateMockQuestions(quizType, difficulty);
      setQuestions(mockQuestions);
      setQuizGenerated(true);
      setIsLoading(false);
      return;
      
      // Generate content from Gemini
      const result = await model.generateContent(prompt);
      console.log("Raw Gemini response:", result);
      const response = await result.response;
      const text = response.text();
      console.log("Gemini response text:", text);
      
      // Parse the JSON response
      let parsedQuestions;
      try {
        parsedQuestions = JSON.parse(text);
        console.log("Parsed questions:", parsedQuestions);
      } catch (parseErr) {
        console.error("Failed to parse Gemini response:", parseErr);
        throw new Error("Failed to parse quiz data");
      }
      
      // Format the questions as needed for your app
      const formattedQuestions = formatGeminiResponse(parsedQuestions, quizType);
      
      setQuestions(formattedQuestions);
      setQuizGenerated(true);
      
    } catch (err) {
      console.error("Gemini API error details:", err);
      // Use mock data as a fallback
      console.log("Using mock questions as fallback");
      const mockQuestions = generateMockQuestions(quizType, difficulty);
      setQuestions(mockQuestions);
      setQuizGenerated(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Format prompt for Gemini API based on input content and quiz settings
  const formatPromptForGemini = (content, type, difficulty) => {
    let prompt = `Generate a ${difficulty} difficulty ${getQuizTypeFullName(type)} quiz based on the following content:\n\n${content}\n\n`;
    
    switch(type) {
      case 'mcq':
        prompt += "Generate 5 multiple choice questions with 4 options each. For each question provide: question text, options (A, B, C, D), correct answer, and a brief explanation.";
        break;
      case 'tf':
        prompt += "Generate 5 true/false questions. For each question provide: question text, whether it's true or false, and a brief explanation.";
        break;
      case 'fitb':
        prompt += "Generate 5 fill-in-the-blank questions. For each question provide: question text with blank indicated by [...], the correct answer for the blank, and a brief explanation.";
        break;
      default:
        prompt += "Generate 5 multiple choice questions with 4 options each.";
    }
    
    prompt += `\nThe difficulty level should be ${difficulty}. Format the response in JSON.`;
    return prompt;
  };

  // Helper function to get full name of quiz type
  const getQuizTypeFullName = (type) => {
    switch(type) {
      case 'mcq': return 'Multiple Choice';
      case 'tf': return 'True/False';
      case 'fitb': return 'Fill in the Blank';
      default: return 'Multiple Choice';
    }
  };

  // Generate mock questions for demo purposes
  const generateMockQuestions = (type, difficulty) => {
    // In a real implementation, this would be replaced with actual Gemini API response parsing
    switch(type) {
      case 'mcq':
        return [
          {
            id: 1,
            question: "What does ACID stand for in database transactions?",
            options: [
              { id: 'A', text: "Atomicity, Consistency, Isolation, Durability" },
              { id: 'B', text: "Automicity, Corruption, Isolation, Durability" },
              { id: 'C', text: "Atomicity, Concurrency, Indexing, Duplication" },
              { id: 'D', text: "Accuracy, Consistency, Integration, Data" }
            ],
            correctAnswer: 'A',
            explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability. These properties ensure reliable database transactions.",
            hint: "Think about the essential properties that guarantee reliable processing of database transactions."
          },
          {
            id: 2,
            question: "Which normal form eliminates transitive dependencies?",
            options: [
              { id: 'A', text: "First Normal Form (1NF)" },
              { id: 'B', text: "Second Normal Form (2NF)" },
              { id: 'C', text: "Third Normal Form (3NF)" },
              { id: 'D', text: "Boyce-Codd Normal Form (BCNF)" }
            ],
            correctAnswer: 'C',
            explanation: "Third Normal Form (3NF) eliminates transitive dependencies, which occur when a non-key attribute depends on another non-key attribute.",
            hint: "It's not 1NF or 2NF, and it comes before BCNF."
          },
          {
            id: 3,
            question: "What type of SQL statement is used to retrieve data from a database?",
            options: [
              { id: 'A', text: "UPDATE" },
              { id: 'B', text: "INSERT" },
              { id: 'C', text: "DELETE" },
              { id: 'D', text: "SELECT" }
            ],
            correctAnswer: 'D',
            explanation: "The SELECT statement is used to retrieve data from a database. It's one of the most common SQL commands.",
            hint: "This statement allows you to specify exactly which data you want to retrieve."
          },
          {
            id: 4,
            question: "Which of the following is NOT a type of database key?",
            options: [
              { id: 'A', text: "Primary Key" },
              { id: 'B', text: "Foreign Key" },
              { id: 'C', text: "Unique Key" },
              { id: 'D', text: "Reference Key" }
            ],
            correctAnswer: 'D',
            explanation: "Reference Key is not a standard type of database key. Common keys include Primary Key, Foreign Key, Unique Key, and Composite Key.",
            hint: "Three of these are standard database key types, but one is not."
          },
          {
            id: 5,
            question: "Which JOIN type returns rows that have matching values in both tables?",
            options: [
              { id: 'A', text: "LEFT JOIN" },
              { id: 'B', text: "RIGHT JOIN" },
              { id: 'C', text: "FULL JOIN" },
              { id: 'D', text: "INNER JOIN" }
            ],
            correctAnswer: 'D',
            explanation: "INNER JOIN returns only the rows where there is a match in both tables being joined.",
            hint: "This is the most common type of join and returns only matching records."
          }
        ];
      case 'tf':
        return [
          {
            id: 1,
            question: "A foreign key can reference any column in another table, even if it's not a primary key.",
            correctAnswer: false,
            explanation: "False. A foreign key must reference a column or set of columns that is either the primary key or a unique key in the referenced table.",
            hint: "Think about the constraints on what a foreign key can reference."
          },
          {
            id: 2,
            question: "SQL stands for Structured Query Language.",
            correctAnswer: true,
            explanation: "True. SQL (Structured Query Language) is the standard language for relational database management systems.",
            hint: "This is the full form of the most common database query language."
          },
          {
            id: 3,
            question: "NoSQL databases strictly follow the ACID properties.",
            correctAnswer: false,
            explanation: "False. NoSQL databases often sacrifice ACID compliance for performance and scalability, following the BASE (Basically Available, Soft state, Eventually consistent) model instead.",
            hint: "Consider the design priorities of NoSQL vs. traditional relational databases."
          },
          {
            id: 4,
            question: "An index improves the speed of data retrieval operations on a database.",
            correctAnswer: true,
            explanation: "True. Indexes are used to quickly locate data without having to search every row in a database table, similar to an index in a book.",
            hint: "Think about how this database feature affects query performance."
          },
          {
            id: 5,
            question: "In a relational database, a table can have multiple primary keys.",
            correctAnswer: false,
            explanation: "False. A table can have only one primary key, though that key may be composed of multiple columns (a composite primary key).",
            hint: "Consider the uniqueness requirements of primary keys in relational database design."
          }
        ];
      case 'fitb':
        return [
          {
            id: 1,
            question: "The [...] clause in SQL is used to filter records based on specified conditions.",
            correctAnswer: "WHERE",
            explanation: "The WHERE clause is used to filter records and extract only those that fulfill a specified condition.",
            hint: "This keyword comes after SELECT and FROM in a basic query syntax."
          },
          {
            id: 2,
            question: "The process of organizing data to minimize redundancy is called database [...].",
            correctAnswer: "normalization",
            explanation: "Database normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity.",
            hint: "This term describes the process of organizing data according to normal forms."
          },
          {
            id: 3,
            question: "A [...] is a special type of stored procedure that executes automatically when specified events occur in the database.",
            correctAnswer: "trigger",
            explanation: "A trigger is a stored procedure that automatically executes when a specified event occurs in the database server.",
            hint: "This feature responds automatically to changes in the database."
          },
          {
            id: 4,
            question: "In database terminology, [...] refers to the property that ensures all transactions are properly completed or completely rolled back.",
            correctAnswer: "atomicity",
            explanation: "Atomicity ensures that each transaction is all or nothing - if any part of the transaction fails, the entire transaction fails and the database state is left unchanged.",
            hint: "This is the 'A' in ACID properties."
          },
          {
            id: 5,
            question: "The SQL command [...] is used to modify existing records in a table.",
            correctAnswer: "UPDATE",
            explanation: "The UPDATE statement is used to modify existing records in a table. It can update one or more field values of one or more records.",
            hint: "This command changes values in existing rows of a table."
          }
        
        ];
      default:
        return [];
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answerId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answerId
    });
    setShowHint(false);
  };

  // Handle confidence rating
  const handleConfidenceRating = (rating) => {
    setConfidenceRatings({
      ...confidenceRatings,
      [currentQuestionIndex]: rating
    });
  };

  // Go to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowHint(false);
    } else {
      setShowResults(true);
    }
  };

  // Go to previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowHint(false);
    }
  };

  // Restart quiz
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setConfidenceRatings({});
    setShowResults(false);
    setShowHint(false);
  };

  // Start new quiz
  const startNewQuiz = () => {
    setFile(null);
    setFileContent('');
    setQuizGenerated(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setConfidenceRatings({});
    setShowResults(false);
    setShowHint(false);
  };

  // Calculate score
  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (quizType === 'mcq' || quizType === 'tf') {
        if (selectedAnswers[index] === question.correctAnswer) {
          correctCount++;
        }
      } else if (quizType === 'fitb') {
        // Case insensitive comparison for fill in the blank
        if (selectedAnswers[index]?.toLowerCase() === question.correctAnswer.toLowerCase()) {
          correctCount++;
        }
      }
    });
    return correctCount;
  };

  // Check if current question has been answered
  const isCurrentQuestionAnswered = () => {
    return selectedAnswers[currentQuestionIndex] !== undefined;
  };

  // Render confetti for good scores
  const renderConfetti = () => {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;
    
    if (percentage >= 80) {
      return (
        <div className="absolute inset-0 pointer-events-none">
          {/* This would be replaced with an actual confetti component in production */}
          <div className="confetti-container"></div>
        </div>
      );
    }
    return null;
  };

  // Render the current question
  const renderQuestion = () => {
    if (!questions.length || currentQuestionIndex >= questions.length) return null;
    
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestionIndex];
    const isAnswered = selectedAnswer !== undefined;
    const isCorrect = quizType === 'fitb' 
      ? selectedAnswer?.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()
      : selectedAnswer === currentQuestion.correctAnswer;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-blue-600">
                {getQuizTypeFullName(quizType)} • {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            </div>
            
            <h3 className="text-xl font-semibold mb-6">{currentQuestion.question}</h3>
            
            {quizType === 'mcq' && (
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(option.id)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-lg transition-all border ${
                      !isAnswered
                        ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                        : isAnswered && option.id === selectedAnswer
                          ? isCorrect
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : option.id === currentQuestion.correctAnswer && isAnswered
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 opacity-70'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`h-6 w-6 mr-3 flex items-center justify-center rounded-full ${
                        !isAnswered
                          ? 'border-2 border-gray-300'
                          : isAnswered && option.id === selectedAnswer
                            ? isCorrect
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                            : option.id === currentQuestion.correctAnswer && isAnswered
                              ? 'bg-green-500 text-white'
                              : 'border-2 border-gray-300'
                      }`}>
                        {isAnswered && option.id === selectedAnswer && (
                          isCorrect ? <FaCheckCircle className="h-4 w-4" /> : <FaTimesCircle className="h-4 w-4" />
                        )}
                        {isAnswered && option.id !== selectedAnswer && option.id === currentQuestion.correctAnswer && (
                          <FaCheckCircle className="h-4 w-4" />
                        )}
                        {!isAnswered && (
                          <span className="text-sm font-medium">{option.id}</span>
                        )}
                      </div>
                      <span>{option.text}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
            
            {quizType === 'tf' && (
              <div className="flex space-x-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswerSelect(true)}
                  disabled={isAnswered}
                  className={`flex-1 p-4 rounded-lg transition-all border ${
                    !isAnswered
                      ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      : isAnswered && selectedAnswer === true
                        ? currentQuestion.correctAnswer === true
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : currentQuestion.correctAnswer === true && isAnswered
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <span className="font-medium">True</span>
                    {isAnswered && selectedAnswer === true && currentQuestion.correctAnswer === true && (
                      <FaCheckCircle className="ml-2 text-green-500" />
                    )}
                    {isAnswered && selectedAnswer === true && currentQuestion.correctAnswer === false && (
                      <FaTimesCircle className="ml-2 text-red-500" />
                    )}
                    {isAnswered && selectedAnswer !== true && currentQuestion.correctAnswer === true && (
                      <FaCheckCircle className="ml-2 text-green-500" />
                    )}
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswerSelect(false)}
                  disabled={isAnswered}
                  className={`flex-1 p-4 rounded-lg transition-all border ${
                    !isAnswered
                      ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                      : isAnswered && selectedAnswer === false
                        ? currentQuestion.correctAnswer === false
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : currentQuestion.correctAnswer === false && isAnswered
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <span className="font-medium">False</span>
                    {isAnswered && selectedAnswer === false && currentQuestion.correctAnswer === false && (
                      <FaCheckCircle className="ml-2 text-green-500" />
                    )}
                    {isAnswered && selectedAnswer === false && currentQuestion.correctAnswer === true && (
                      <FaTimesCircle className="ml-2 text-red-500" />
                    )}
                    {isAnswered && selectedAnswer !== false && currentQuestion.correctAnswer === false && (
                      <FaCheckCircle className="ml-2 text-green-500" />
                    )}
                  </div>
                </motion.button>
              </div>
            )}
            
            {quizType === 'fitb' && (
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Type your answer here..."
                  value={selectedAnswers[currentQuestionIndex] || ''}
                  onChange={(e) => handleAnswerSelect(e.target.value)}
                  disabled={isAnswered}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isAnswered
                      ? isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                  }`}
                />
                
                {isAnswered && (
                  <div className="mt-3 text-sm">
                    <span className="font-medium">Correct answer: </span>
                    <span className="text-green-600">{currentQuestion.correctAnswer}</span>
                  </div>
                )}
              </div>
            )}
            
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`p-4 rounded-lg mb-6 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
              >
                <h4 className={`font-medium mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? 'Correct! 🎉' : 'Incorrect'}
                </h4>
                <p className="text-gray-700">{currentQuestion.explanation}</p>
              </motion.div>
            )}
            
            {isAnswered && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">How confident were you about this answer?</p>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <motion.button
                      key={rating}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleConfidenceRating(rating)}
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                        confidenceRatings[currentQuestionIndex] === rating
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {rating}
                    </motion.button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">1 = Guessed, 5 = Absolutely certain</p>
              </div>
            )}
            
            {!isAnswered && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowHint(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mb-6"
              >
                <FaRegLightbulb className="mr-1" /> Need a hint?
              </motion.button>
            )}
            
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6"
                >
                  <p className="text-blue-800">{currentQuestion.hint}</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  currentQuestionIndex === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaArrowLeft className="mr-2" /> Previous
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextQuestion}
                disabled={!isCurrentQuestionAnswered()}
                className={`flex items-center px-6 py-2 rounded-lg ${
                  !isCurrentQuestionAnswered()
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'} <FaArrowRight className="ml-2" />
              </motion.button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="flex space-x-1">
              {questions.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 rounded-full ${
                    index === currentQuestionIndex
                      ? 'w-6 bg-blue-500'
                      : selectedAnswers[index] !== undefined
                        ? 'w-2 bg-green-500'
                        : 'w-2 bg-gray-300'
                  }`}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: index === currentQuestionIndex ? 1 : 0.8, opacity: index === currentQuestionIndex ? 1 : 0.7 }}
                ></motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Render quiz results
  const renderResults = () => {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;
    
    let message = "";
    let color = "";
    
    if (percentage >= 90) {
      message = "Outstanding! You've mastered this material! 🏆";
      color = "text-green-600";
    } else if (percentage >= 70) {
      message = "Great job! You're doing well! 🌟";
      color = "text-green-600";
    } else if (percentage >= 50) {
      message = "Good effort! Review a bit more to improve. 📚";
      color = "text-yellow-600";
    } else {
      message = "Keep practicing! You'll get there. 💪";
      color = "text-red-600";
    }
    
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-lg p-6"
      >
        {renderConfetti()}
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
          <div className="bg-blue-50 rounded-full h-36 w-36 flex items-center justify-center mx-auto mb-4">
            <div className="text-3xl font-bold text-blue-600">{score}/{questions.length}</div>
          </div>
          <p className={`text-lg font-medium ${color}`}>{message}</p>
          <p className="text-gray-600 mt-2">{percentage.toFixed(0)}% correct</p>
        </motion.div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Performance Breakdown</h3>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = quizType === 'fitb' 
                ? userAnswer?.toLowerCase() === question.correctAnswer.toLowerCase()
                : userAnswer === question.correctAnswer;
              const confidence = confidenceRatings[index] || 0;
              
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`p-4 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">Question {index + 1}</h4>
                      <p className="text-sm text-gray-700">{question.question}</p>
                      
                      <div className="mt-2 text-sm">
                        <div>
                          <span className="font-medium">Your answer: </span>
                          <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                            {quizType === 'mcq' && question.options.find(opt => opt.id === userAnswer)?.text}
                            {quizType === 'tf' && (userAnswer === true ? 'True' : 'False')}
                            {quizType === 'fitb' && userAnswer}
                          </span>
                        </div>
                        
                        {!isCorrect && (
                          <div>
                            <span className="font-medium">Correct answer: </span>
                            <span className="text-green-600">
                              {quizType === 'mcq' && question.options.find(opt => opt.id === question.correctAnswer)?.text}
                              {quizType === 'tf' && (question.correctAnswer === true ? 'True' : 'False')}
                              {quizType === 'fitb' && question.correctAnswer}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {confidence > 0 && (
                      <div className="flex items-center ml-4">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star}>
                              {star <= confidence ? (
                                <FaStar className="text-yellow-400 h-4 w-4" />
                              ) : (
                                <FaRegStar className="text-gray-300 h-4 w-4" />
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={restartQuiz}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            <FaRedo className="mr-2 inline" /> Retake Quiz
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startNewQuiz}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            <FaRegFileAlt className="mr-2 inline" /> New Quiz
          </motion.button>
        </div>
      </motion.div>
    );
  };

  // Main render
  return (
    <>
      <Navbar /> {/* Add the Navbar component here */}
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-16"> {/* Added pt-16 to give space below navbar */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">AI Study Assistant</h1>
          <p className="text-gray-600 mb-8 text-center">Upload your notes and generate interactive quizzes</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {!file && !quizGenerated && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-lg p-8 text-center"
            >
              <motion.div variants={itemVariants} className="mb-8">
                <FaRegFileAlt className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Upload Your Study Material</h2>
                <p className="text-gray-600">Upload a text file with your notes to generate a quiz</p>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".txt,.doc,.docx,.pdf,.md"
                />
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUploadClick}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition flex items-center justify-center mx-auto"
                >
                  <FaUpload className="mr-2" /> Choose File
                </motion.button>
              </motion.div>
            </motion.div>
          )}
          
          {file && !quizGenerated && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FaRegFileAlt className="text-blue-500 h-6 w-6 mr-3" />
                  <div>
                    <h3 className="font-medium">{file.name}</h3>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <FaTimesCircle />
                </button>
              </motion.div>
              
              <motion.div variants={itemVariants} className="mb-8">
                <h3 className="font-medium mb-2">Quiz Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Type</label>
                    <select
                      value={quizType}
                      onChange={(e) => setQuizType(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="mcq">Multiple Choice</option>
                      <option value="tf">True/False</option>
                      <option value="fitb">Fill in the Blank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="moderate">Moderate</option>
                      <option value="difficult">Difficult</option>
                    </select>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generateQuiz}
                  disabled={isLoading}
                  className={`px-8 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition flex items-center justify-center mx-auto ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Generating...
                    </>
                  ) : (
                    <>
                      Generate Quiz
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
          
          {quizGenerated && !showResults && renderQuestion()}
          {showResults && renderResults()}
        </div>
      </div>
    </>
  );
};

export default QuizMe;