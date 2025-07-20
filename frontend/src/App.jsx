import { Routes, Route } from 'react-router-dom';
import Intro from './components/intro';
import Register from './components/Register';
import Login from './components/Login'; 
import Home from './components/Home';
import BuyNowPage from './components/buynow';// optional

function App() {
  return (
    <Routes>
      <Route path="/" element={<Intro />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Home" element={<Home />} />
       <Route path="/buynow/:id" element={<BuyNowPage />} />
 
    </Routes>
  );
}

export default App;
