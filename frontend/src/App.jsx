import { Routes, Route } from 'react-router-dom';
import Intro from './components/Intro';
import Register from './components/Register';
import Login from './components/Login'; 
import Home from './components/Home';// optional

function App() {
  return (
    <Routes>
      <Route path="/" element={<Intro />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Home" element={<Home />} />
    </Routes>
  );
}

export default App;
