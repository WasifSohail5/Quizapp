import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash, FiUsers, FiBarChart2, FiBook, FiLogOut, FiMenu } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(6);
  const [form, setForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    type: 'mcq',
    grade: 6,
    timeThreshold: 30,
  });
  const [userForm, setUserForm] = useState({ name: '', grade: 6, email: '', password: '' });
  const [users, setUsers] = useState([]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      if (!token || !isAdmin) {
        navigate('/admin-login', { replace: true });
        return;
      }
      try {
        const [questionsRes, usersRes, statsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/questions', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setQuestions(questionsRes.data);
        setFilteredQuestions(questionsRes.data.filter(q => q.grade === selectedGrade));
        setUsers(usersRes.data);
        setStats(statsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        navigate('/admin-login', { replace: true });
      }
    };
    checkAuth();
  }, [navigate, selectedGrade]);

  useEffect(() => {
    setFilteredQuestions(questions.filter(q => q.grade === selectedGrade));
  }, [selectedGrade, questions]);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...form,
        options: form.type === 'mcq' || form.type === 'drag' ? form.options : [],
        grade: parseInt(form.grade),
      };
      if (editingQuestionId) {
        await axios.put(`http://localhost:5000/api/admin/questions/${editingQuestionId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(questions.map(q => (q._id === editingQuestionId ? { ...payload, _id: editingQuestionId } : q)));
        setEditingQuestionId(null);
      } else {
        const res = await axios.post('http://localhost:5000/api/admin/questions', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions([...questions, res.data]);
      }
      setForm({ question: '', options: ['', '', '', ''], correctAnswer: '', type: 'mcq', grade: 6, timeThreshold: 30 });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save question');
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = { ...userForm, grade: parseInt(userForm.grade) };
      const res = await axios.post('http://localhost:5000/api/admin/users', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers([...users, res.data]);
      setUserForm({ name: '', grade: 6, email: '', password: '' });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user._id !== userId));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleEditQuestion = (question) => {
    setForm({
      question: question.question,
      options: question.options.length ? question.options : ['', '', '', ''],
      correctAnswer: question.correctAnswer,
      type: question.type,
      grade: question.grade,
      timeThreshold: question.timeThreshold,
    });
    setEditingQuestionId(question._id);
  };

  const handleDeleteQuestion = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(questions.filter(q => q._id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete question');
    }
  };

  const handleGradeChange = (grade) => {
    setSelectedGrade(grade);
    setForm({ ...form, grade });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/admin-login', { replace: true });
  };

  const chartData = stats
    ? {
        labels: stats.questionsPerGrade.map(g => `Grade ${g._id}`),
        datasets: [
          {
            label: 'Questions per Grade',
            data: stats.questionsPerGrade.map(g => g.count),
            backgroundColor: 'rgba(45, 212, 191, 0.6)',
            borderColor: 'rgba(45, 212, 191, 1)',
            borderWidth: 1,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Questions',
          font: { size: 14 },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Grade',
          font: { size: 14 },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Questions per Grade',
        font: { size: 16 },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-teal-100 to-orange-100 flex"
    >
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-teal-600 text-white p-4 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50 shadow-lg`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">MathChrono Admin</h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <FiMenu size={24} />
          </button>
        </div>
        <nav className="space-y-4">
          <button
            onClick={() => {
              document.getElementById('analytics').scrollIntoView({ behavior: 'smooth' });
              setSidebarOpen(false);
            }}
            className="w-full text-left py-2 px-4 bg-teal-700 rounded hover:bg-teal-800 flex items-center transition-colors"
          >
            <FiBarChart2 className="mr-2" /> Analytics
          </button>
          <button
            onClick={() => {
              document.getElementById('questions').scrollIntoView({ behavior: 'smooth' });
              setSidebarOpen(false);
            }}
            className="w-full text-left py-2 px-4 bg-teal-700 rounded hover:bg-teal-800 flex items-center transition-colors"
          >
            <FiBook className="mr-2" /> Questions
          </button>
          <button
            onClick={() => {
              document.getElementById('users').scrollIntoView({ behavior: 'smooth' });
              setSidebarOpen(false);
            }}
            className="w-full text-left py-2 px-4 bg-teal-700 rounded hover:bg-teal-800 flex items-center transition-colors"
          >
            <FiUsers className="mr-2" /> Users
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-4 bg-red-500 rounded hover:bg-red-600 flex items-center transition-colors"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:ml-64">
        <div className="container mx-auto max-w-6xl bg-white bg-opacity-95 rounded-xl shadow-2xl p-4 sm:p-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden mb-4 p-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
          >
            <FiMenu size={24} />
          </button>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-600 text-center mb-4 sm:mb-6"
          >
            Admin Dashboard
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

          {/* Analytics Section */}
          <motion.div
            id="analytics"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-teal-600 mb-4">Analytics</h2>
            {stats && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-teal-500 text-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <FiUsers className="text-2xl sm:text-3xl mb-2" />
                    <h3 className="text-base sm:text-xl font-bold">Participants</h3>
                    <p className="text-lg sm:text-2xl">{stats.numParticipants}</p>
                  </div>
                  <div className="bg-orange-500 text-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <FiBarChart2 className="text-2xl sm:text-3xl mb-2" />
                    <h3 className="text-base sm:text-xl font-bold">Submissions</h3>
                    <p className="text-lg sm:text-2xl">{stats.numSubmissions}</p>
                  </div>
                  <div className="bg-purple-500 text-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <FiBarChart2 className="text-2xl sm:text-3xl mb-2" />
                    <h3 className="text-base sm:text-xl font-bold">Average Score</h3>
                    <p className="text-lg sm:text-2xl">{stats.averageScore.toFixed(2)}</p>
                  </div>
                  <div className="bg-blue-500 text-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <FiBook className="text-2xl sm:text-3xl mb-2" />
                    <h3 className="text-base sm:text-xl font-bold">Total Questions</h3>
                    <p className="text-lg sm:text-2xl">{stats.questionsPerGrade.reduce((sum, g) => sum + g.count, 0)}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-teal-600 mb-4">Questions per Grade</h3>
                  {chartData && (
                    <div className="bg-white p-4 rounded-lg shadow-md" style={{ height: '300px' }}>
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>

          {/* Grade Selector */}
          <motion.div
            id="questions"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-teal-600 mb-4">Select Grade</h2>
            <div className="flex flex-wrap gap-2">
              {[6, 7, 8, 9, 10, 11].map(grade => (
                <motion.button
                  key={grade}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleGradeChange(grade)}
                  className={`py-2 px-4 rounded-lg font-semibold text-sm sm:text-base transition-colors ${
                    selectedGrade === grade ? 'bg-teal-500 text-white' : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                  }`}
                >
                  Grade {grade}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Question Management */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-teal-600 mb-4">Manage Questions for Grade {selectedGrade}</h2>
            <form onSubmit={handleQuestionSubmit} className="space-y-4 mb-6 bg-teal-50 p-4 sm:p-6 rounded-lg shadow-md">
              <div>
                <label className="block text-teal-700 font-semibold mb-1 text-sm sm:text-base">Question</label>
                <input
                  type="text"
                  placeholder="Enter question"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="w-full p-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-teal-700 font-semibold mb-1 text-sm sm:text-base">Question Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full p-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
                >
                  <option value="mcq">Multiple Choice</option>
                  <option value="fill">Fill in the Blank</option>
                  <option value="drag">Drag and Drop</option>
                  <option value="puzzle">Puzzle</option>
                </select>
              </div>
              {(form.type === 'mcq' || form.type === 'drag') && (
                <div>
                  <label className="block text-teal-700 font-semibold mb-1 text-sm sm:text-base">Options</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {form.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...form.options];
                          newOptions[index] = e.target.value;
                          setForm({ ...form, options: newOptions });
                        }}
                        className="p-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
                        required
                      />
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-teal-700 font-semibold mb-1 text-sm sm:text-base">Correct Answer</label>
                <input
                  type="text"
                  placeholder="Enter correct answer"
                  value={form.correctAnswer}
                  onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
                  className="w-full p-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-teal-700 font-semibold mb-1 text-sm sm:text-base">Time Threshold (seconds)</label>
                <input
                  type="number"
                  placeholder="Time Threshold"
                  value={form.timeThreshold}
                  onChange={(e) => setForm({ ...form, timeThreshold: parseInt(e.target.value) })}
                  className="w-full p-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
                  min="15"
                  max="60"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-teal-500 text-white rounded-lg font-bold flex items-center justify-center text-sm sm:text-base hover:bg-teal-600 transition-colors"
              >
                <FiPlus className="mr-2" /> {editingQuestionId ? 'Update Question' : 'Add Question'}
              </motion.button>
            </form>

            <div className="space-y-4">
              <h3 className="text-base sm:text-xl font-semibold text-teal-600">
                Questions (Total: {filteredQuestions.length}/30)
              </h3>
              {filteredQuestions.length === 0 ? (
                <p className="text-gray-600 text-sm sm:text-base">No questions for Grade {selectedGrade} yet.</p>
              ) : (
                filteredQuestions.map(q => (
                  <motion.div
                    key={q._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-teal-50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-md"
                  >
                    <div>
                      <p className="font-semibold text-sm sm:text-base">{q.question} ({q.type})</p>
                      <p className="text-sm sm:text-base">Correct: {q.correctAnswer}</p>
                      {q.options.length > 0 && <p className="text-sm sm:text-base">Options: {q.options.join(', ')}</p>}
                      <p className="text-sm sm:text-base">Time: {q.timeThreshold}s</p>
                    </div>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditQuestion(q)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <FiEdit />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteQuestion(q._id)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        <FiTrash />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* User Management */}
          <motion.div
            id="users"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-teal-600 mb-4">Manage Users</h2>
            <form onSubmit={handleUserSubmit} className="space-y-4 mb-6 bg-teal-50 p-4 sm:p-6 rounded-lg shadow-md">
              <div>
                <label className="block text-teal-700 font-semibold mb-1 text-sm sm:text-base">Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full p-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-teal-700 font-semibold mb-1 text-sm sm:text-base">Grade</label>
                <select
                  value={userForm.grade}
                  onChange={(e) => setUserForm({ ...userForm, grade: e.target.value })}
                  className="w-full p-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
                >
                  {[6, 7, 8, 9, 10, 11].map(g => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-teal-700 font-semibold mb-1 text-sm sm:text-base">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full p-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-teal-700 font-semibold mb-1 text-sm sm:text-base">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full p-3 border-2 border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-teal-500 text-white rounded-lg font-bold flex items-center justify-center text-sm sm:text-base hover:bg-teal-600 transition-colors"
              >
                <FiPlus className="mr-2" /> Add User
              </motion.button>
            </form>

            <div className="space-y-4">
              <h3 className="text-base sm:text-xl font-semibold text-teal-600">Users</h3>
              {users.length === 0 ? (
                <p className="text-gray-600 text-sm sm:text-base">No users yet.</p>
              ) : (
                users.map(u => (
                  <motion.div
                    key={u._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-teal-50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-md"
                  >
                    <div>
                      <p className="font-semibold text-sm sm:text-base">{u.name} ({u.email}, Grade {u.grade})</p>
                      <p className="text-sm sm:text-base">Participant ID: {u.participantId}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors mt-2 sm:mt-0"
                    >
                      <FiTrash />
                    </motion.button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default AdminDashboard;