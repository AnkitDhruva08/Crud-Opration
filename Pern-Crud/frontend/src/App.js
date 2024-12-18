import './App.css';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import InsertStudent from './components/InsertStudent'
import UpdateStudent from './components/UpdateStudent';
import About from './components/About';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';




function App() {
  return (
    <div className="App">
      <Navbar title="IMS" about="About"></Navbar>

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/addstudent" element={<InsertStudent />} />
          <Route path="/updatestudent/:id" element={<UpdateStudent />} />
          <Route path="/about" element={<About />} />

        </Routes>

      </Router>


    </div>
  );
}

export default App;
