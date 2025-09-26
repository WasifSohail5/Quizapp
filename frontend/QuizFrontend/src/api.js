import axios from "axios";

const API = axios.create({
  baseURL: "https://quizapp-production-4ca9.up.railway.app/api"
});

export default API;
