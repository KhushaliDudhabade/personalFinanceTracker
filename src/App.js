import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import SignupPage from './Pages/SignupPage';
import DashboardPage from './Pages/DashboardPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <ToastContainer/>
    <Router> {/* Use BrowserRouter as Router */}
      <Routes>
        <Route path='/' element={<SignupPage />} /> {/* Define your routes */}
        <Route path='/dashboardpage' element={<DashboardPage />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
