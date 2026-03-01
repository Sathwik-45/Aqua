// Central API configuration for the frontend
const API_BASE =
    window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
        ? "http://localhost:5000"
        : "https://aqua-2-ovd4.onrender.com"; // New Render URL

export default API_BASE;
