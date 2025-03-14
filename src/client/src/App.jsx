import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Form from './components/Form';
import Login from './components/Login';
import Playlist from './components/Playlist';
import './App.css';

const App = () => {
  return (
    <Router>
  <div className="app">
    <Header />
    <main className="content">
      <nav>
        <ul>
          <li><Link to="/form">Form</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/playlist">Playlist</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/form" element={<Form />} />
        <Route path="/login" element={<Login />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/" element={<Form />} /> {/* Default route */}
      </Routes>
    </main>
    <Footer />
  </div>
</Router>

  );
};

export default App;
