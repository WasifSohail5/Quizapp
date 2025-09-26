import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: form.email,
        password: form.password,
      });
      if (!res.data.isAdmin) {
        setError('Admin access required');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('isAdmin', res.data.isAdmin);
      setLoading(false);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="min-h-screen bg-gradient-to-br from-teal-100 to-orange-100 flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-white bg-opacity-95 p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl max-w-full sm:max-w-md w-full">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-600 text-center mb-6 sm:mb-8"
        >
          Admin Login
        </motion.h1>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 text-center mb-4 text-sm sm:text-base bg-red-100 p-3 rounded-lg"
          >
            {error}
          </motion.p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-teal-500" />
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-10 p-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
              required
            />
          </div>
          <div className="relative">
            <FiLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-teal-500" />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-10 p-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-teal-500 text-white rounded-lg font-bold flex items-center justify-center text-sm sm:text-base ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-600'
            }`}
          >
            {loading ? (
              'Logging in...'
            ) : (
              <>
                <FiLogIn className="mr-2" /> Login
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default AdminLogin;