// Central API configuration for the frontend
const API_BASE =
    window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
        ? "http://localhost:5000"
        : "https://aqua-tml9.onrender.com"; // Replace with your new Render URL after deployment

export default API_BASE;
