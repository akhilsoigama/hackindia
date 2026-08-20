import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Define types for our quiz data
interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionsCount: number;
  image: string;
  played: number;
}

const Quiz: React.FC = () => {
  // Sample quiz data
  const quizzes: Quiz[] = [
    {
      id: 1,
      title: 'World Capitals',
      description: 'Test your knowledge of world capitals',
      category: 'Geography',
      difficulty: 'Easy',
      questionsCount: 10,
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      played: 1245
    },
    {
      id: 2,
      title: 'Movie Trivia',
      description: 'How well do you know classic films?',
      category: 'Entertainment',
      difficulty: 'Medium',
      questionsCount: 15,
      image: 'https://i.ytimg.com/vi/Ma0nf6i8uYE/hqdefault.jpg',
      played: 2876
    },
    {
      id: 3,
      title: 'Science & Nature',
      description: 'Explore the wonders of science and nature',
      category: 'Science',
      difficulty: 'Hard',
      questionsCount: 20,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      played: 932
    },
    {
      id: 4,
      title: 'Sports Champions',
      description: 'Test your knowledge of sports history',
      category: 'Sports',
      difficulty: 'Medium',
      questionsCount: 12,
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      played: 3562
    },
    {
      id: 5,
      title: 'Music Through the Ages',
      description: 'From classical to modern hits',
      category: 'Music',
      difficulty: 'Easy',
      questionsCount: 15,
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      played: 4187
    },
    {
      id: 6,
      title: 'Culinary Knowledge',
      description: 'How well do you know food and cooking?',
      category: 'Food',
      difficulty: 'Medium',
      questionsCount: 18,
      image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      played: 2109
    }
  ];

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
  };

  const handlePlayQuiz = () => {
    if (selectedQuiz) {
      alert(`Starting quiz: ${selectedQuiz.title}`);
      // In a real app, you would navigate to the quiz page here
    }
  };

  const handleCloseDetail = () => {
    setSelectedQuiz(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Quiz Gallery</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our collection of quizzes. Click on any quiz to see details and play.
          </p>
        </motion.div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300"
              onClick={() => handleQuizSelect(quiz)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={quiz.image} 
                  alt={quiz.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {quiz.difficulty}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>
                <div className="flex justify-between items-center">
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {quiz.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {quiz.questionsCount} questions
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quiz Detail Modal */}
        {selectedQuiz && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative h-64 sm:h-80">
                <img 
                  src={selectedQuiz.image} 
                  alt={selectedQuiz.title}
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={handleCloseDetail}
                  className="absolute top-4 right-4 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {selectedQuiz.difficulty}
                </div>
              </div>
              
              <div className="p-6 sm:p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedQuiz.title}</h2>
                <p className="text-gray-600 mb-6">{selectedQuiz.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-semibold text-gray-800">{selectedQuiz.category}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Questions</p>
                    <p className="font-semibold text-gray-800">{selectedQuiz.questionsCount}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className="font-semibold text-gray-800">{selectedQuiz.difficulty}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Played</p>
                    <p className="font-semibold text-gray-800">{selectedQuiz.played.toLocaleString()} times</p>
                  </div>
                </div>
                
                <button 
                  onClick={handlePlayQuiz}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md"
                >
                  Play Quiz
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;