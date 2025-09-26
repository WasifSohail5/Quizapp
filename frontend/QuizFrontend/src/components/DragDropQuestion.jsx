import { useState } from 'react';
import { motion } from 'framer-motion';

function DragDropQuestion({ question, onAnswer }) {
  const [dropped, setDropped] = useState(null);

  const handleDragStart = (e, option) => {
    e.dataTransfer.setData('text', option);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const answer = e.dataTransfer.getData('text');
    setDropped(answer);
    onAnswer(answer);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col items-center space-y-6"
    >
      <p className="text-xl font-semibold text-teal-600">{question.question}</p>
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <motion.div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, option)}
            whileHover={{ scale: 1.05 }}
            className="bg-teal-500 text-white p-4 rounded-lg cursor-move shadow-md"
          >
            {option}
          </motion.div>
        ))}
        <div
          className="border-2 border-dashed border-teal-300 p-6 rounded-lg text-center min-h-[100px]"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {dropped || 'Drop answer here'}
        </div>
      </div>
    </motion.div>
  );
}
export default DragDropQuestion;