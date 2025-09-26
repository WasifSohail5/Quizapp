import { motion } from 'framer-motion';

function InstructionalVideo({ onComplete }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    >
      <video
        autoPlay
        onEnded={onComplete}
        className="w-3/4 rounded-lg shadow-lg"
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </motion.div>
  );
}
export default InstructionalVideo;