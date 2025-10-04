import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { Link, useNavigate } from 'react-router-dom';
import { getToken } from '../utils';

export default function BookList() {
  const [booksData, setBooksData] = useState({ books: [], page: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetch = async () => {
    try {
      const res = await axios.get(`${API_BASE}/books?page=${page}&search=${encodeURIComponent(search)}`);
      setBooksData(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  useEffect(() => { fetch(); }, [page]);

  const onSearch = async (e) => {
    e.preventDefault();
    setPage(1);
    fetch();
  };

  // ✅ Require login before accessing add book or book details
  const handleProtectedAction = (action) => {
    if (!getToken()) {
      navigate('/login');
    } else {
      action();
    }
  };

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">📚 Book Library</h2>

        <button
          className="btn btn-primary shadow-sm"
          onClick={() => handleProtectedAction(() => navigate('/books/new'))}
        >
          ➕ Add New Book
        </button>
      </div>

      {/* Search */}
      <form className="mb-4" onSubmit={onSearch}>
        <div className="input-group shadow-sm">
          <input
            className="form-control"
            placeholder="🔍 Search by title or author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-primary">Search</button>
        </div>
      </form>

      {/* Book Grid */}
      {booksData.books.length === 0 && (
        <p className="text-muted text-center mt-5">No books found. Try adding some!</p>
      )}
      <div className="row g-4">
        {booksData.books.map(b => (
          <div key={b._id} className="col-md-4 col-sm-6">
            <div
              className="text-decoration-none text-dark"
              style={{ cursor: 'pointer' }}
              onClick={() => handleProtectedAction(() => navigate(`/books/${b._id}`))}
            >
              <div className="book-card h-100">
                {/* Book Image */}
                {b.image ? (
                  <div className="book-image-wrapper">
                    <img src={`${API_BASE.replace('/api','')}${b.image}`} alt={b.title} className="book-image" />
                  </div>
                ) : (
                  <div className="book-image-wrapper placeholder d-flex align-items-center justify-content-center">
                    <span className="text-muted">No Cover</span>
                  </div>
                )}

                {/* Book Info */}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold text-truncate">{b.title}</h5>
                  <h6 className="text-muted mb-2">by {b.author}</h6>
                  <p className="card-text flex-grow-1">
                    {b.description?.slice(0, 120) || "No description available."}
                  </p>
                  <small className="text-muted mt-auto">Added by: {b.addedBy?.name}</small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4 d-flex justify-content-center align-items-center gap-3">
        <button
          className="btn btn-outline-primary"
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          ⬅ Prev
        </button>
        <span className="fw-semibold">
          Page {booksData.page} / {booksData.totalPages}
        </span>
        <button
          className="btn btn-outline-primary"
          disabled={page === booksData.totalPages}
          onClick={() => setPage(p => Math.min(booksData.totalPages, p + 1))}
        >
          Next ➡
        </button>
      </div>

      {/* Styling */}
      <style>{`
        .book-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e5e5e5;
          overflow: hidden;
          transition: all 0.3s ease-in-out;
          display: flex;
          flex-direction: column;
        }

        .book-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
        }

        /* Image styling */
        .book-image-wrapper {
          height: 200px;
          overflow: hidden;
          border-bottom: 1px solid #eee;
        }

        .book-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .book-card:hover .book-image {
          transform: scale(1.08);
        }

        /* Placeholder style */
        .placeholder {
          background: #f8f9fa;
          color: #aaa;
          font-size: 14px;
          font-style: italic;
        }

        .card-body {
          padding: 1rem;
        }

        .card-body h5 {
          color: #222;
        }

        .card-body h6 {
          font-style: italic;
          font-size: 0.9rem;
        }

        .card-body p {
          font-size: 0.95rem;
          line-height: 1.4;
          color: #444;
        }
      `}</style>
    </div>
  );
}
