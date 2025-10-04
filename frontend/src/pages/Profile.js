import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import { authHeader, getToken } from "../utils";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) return navigate("/login");

    // Decode user info from JWT
    const decoded = JSON.parse(atob(token.split(".")[1])).user;
    setUser(decoded);

    // Fetch books and filter only user's books
    axios
      .get(`${API_BASE}/books?page=1`, { headers: authHeader() })
      .then((res) => {
        const mine = res.data.books.filter(
          (b) => b.addedBy && b.addedBy._id === decoded.id
        );
        setBooks(mine);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="container py-4">
      {/* Profile Info */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body">
          <h4 className="fw-bold mb-1">{user?.name}</h4>
          <p className="text-muted mb-0">{user?.email}</p>
        </div>
      </div>

      {/* Books List */}
      <h5 className="fw-bold mb-3">Your Books</h5>
      {books.length === 0 ? (
        <p className="text-muted">
          You haven’t added any books yet.{" "}
          <Link to="/books/new" className="text-decoration-none fw-semibold">
            Add your first book
          </Link>
        </p>
      ) : (
        <ul className="list-group shadow-sm rounded-3">
          {books.map((b) => (
            <li
              key={b._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {b.title}
              <Link
                to={`/books/${b._id}`}
                className="btn btn-sm btn-outline-primary"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
