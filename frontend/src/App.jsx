import { Routes, Route } from "react-router-dom";
import Intro from "./components/Intro";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Home from "./components/Home";
import BuyNowPage from "./components/buynow";
import PaymentPage from "./components/paymentpage";
import Myorders from "./components/Myorders";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/buynow/:id" element={<BuyNowPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/my-orders" element={<Myorders />} />
      </Routes>
    </div>
  );
}

export default App;
