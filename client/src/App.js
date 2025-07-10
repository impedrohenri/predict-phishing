import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/home';
import 'bootstrap/dist/css/bootstrap.css';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
