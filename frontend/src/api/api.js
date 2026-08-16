import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({ baseURL, timeout: 8000 });

export const createSession = () => api.post("/session").then((r) => r.data);

export const logEvent = (sessionId, scenario, action) =>
  api.post(`/session/${sessionId}/event`, { scenario, action }).then((r) => r.data);

export const getScore = (sessionId) =>
  api.get(`/session/${sessionId}/score`).then((r) => r.data);

export const getReportUrl = (sessionId) =>
  `${baseURL}/session/${sessionId}/report`;

export const checkUrlSafety = (url) =>
  api.post("/check-url", { url }).then((r) => r.data);

export const getLegalFacts = (category) =>
  api.get("/legal-facts", { params: category ? { category } : {} }).then((r) => r.data);
export const getThreats = (severity) =>
  api.get("/threats", { params: severity ? { severity } : {} }).then((r) => r.data);

export default api;
