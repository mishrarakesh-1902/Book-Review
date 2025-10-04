import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import AddEditBook from './pages/AddEditBook';
import Profile from './pages/Profile';
import { getToken, clearToken } from './utils';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm bg-white mb-4">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo / Brand */}
        <Link className="navbar-brand fw-bold text-primary fs-4" to="/">
          📚 BookReviews
        </Link>

        {/* Right-side Buttons */}
        <div>
          {!isLoggedIn ? (
            <>
              <Link className="btn btn-outline-primary me-2 fw-semibold" to="/signup">
                Sign Up
              </Link>
              <Link className="btn btn-primary fw-semibold" to="/login">
                Login
              </Link>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-secondary me-2 fw-semibold" to="/profile">
                Profile
              </Link>
              <button
                className="btn btn-danger fw-semibold"
                onClick={handleLogout}
                style={{ transition: '0.3s' }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container py-3">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/books/new" element={<AddEditBook />} />
          <Route path="/books/edit/:id" element={<AddEditBook />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
