import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getToken, authHeader } from '../utils';

export default function BookDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, reviewText: '' });
  const navigate = useNavigate();

  const fetch = async () => {
    const res = await axios.get(`${API_BASE}/books/${id}`);
    setData(res.data);
  };

  useEffect(() => { fetch(); }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!getToken()) return navigate('/login');
    await axios.post(`${API_BASE}/reviews/${id}`, reviewForm, { headers: authHeader() });
    setReviewForm({ rating: 5, reviewText: '' });
    fetch();
  };

  const deleteBook = async () => {
    if (!getToken()) return navigate('/login');
    await axios.delete(`${API_BASE}/books/${id}`, { headers: authHeader() });
    navigate('/');
  };

  return data ? (
    <div className="container py-4">
      {/* Book Details Section */}
      <div className="row align-items-start mb-4">
        {/* Book Image */}
        <div className="col-md-4 text-center mb-3">
          <div className="book-cover-wrapper shadow-sm">
            {data.book.image ? (
              <img
                src={API_BASE.replace('/api', '') + data.book.image}
                alt="Book Cover"
                className="img-fluid rounded-4"
              />
            ) : (
              <div className="placeholder rounded-4 d-flex align-items-center justify-content-center">
                <span className="text-muted">No Cover</span>
              </div>
            )}
          </div>
        </div>

        {/* Book Info */}
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h2 className="fw-bold text-primary">{data.book.title}</h2>
            <div>
              <Link className="btn btn-outline-secondary me-2" to={`/books/edit/${data.book._id}`}>✏ Edit</Link>
              <button className="btn btn-danger" onClick={deleteBook}>🗑 Delete</button>
            </div>
          </div>
          <h5 className="mb-2 text-muted">by {data.book.author}</h5>
          <p><strong>Genre:</strong> {data.book.genre} | <strong>Year:</strong> {data.book.year}</p>
          <p className="lead">{data.book.description}</p>
          <span className="badge bg-warning text-dark fs-6">
            ⭐ Average Rating: {data.averageRating}
          </span>
        </div>
      </div>

      <hr />

      {/* Reviews Section */}
      <h4 className="mb-3">📢 Reviews</h4>
      {data.reviews.length === 0 && <p className="text-muted">No reviews yet.</p>}
      <div className="list-group mb-4">
        {data.reviews.map(r => (
          <div key={r._id} className="list-group-item border-0 shadow-sm rounded-3 mb-3">
            <div className="d-flex justify-content-between">
              <strong>{r.userId?.name}</strong>
              <span className="text-warning">{r.rating} ★</span>
            </div>
            <p className="mt-2">{r.reviewText}</p>
          </div>
        ))}
      </div>

      {/* Add Review */}
      <h5 className="mb-3">✍ Add a Review</h5>
      <form onSubmit={submitReview} className="shadow-sm p-3 rounded-3 bg-light">
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <select
            className="form-select"
            value={reviewForm.rating}
            onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
          >
            {[5, 4, 3, 2, 1].map(v => <option key={v} value={v}>{v} ★</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Your Review</label>
          <textarea
            className="form-control"
            placeholder="Write your review..."
            value={reviewForm.reviewText}
            onChange={e => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
          />
        </div>
        <button className="btn btn-primary">Submit Review</button>
      </form>

      {/* Extra Styling */}
      <style>{`
        .book-cover-wrapper {
          border-radius: 16px;
          overflow: hidden;
          background: #f8f9fa;
          padding: 8px;
        }
        .book-cover-wrapper img {
          transition: transform 0.4s ease;
        }
        .book-cover-wrapper:hover img {
          transform: scale(1.05);
        }
        .placeholder {
          height: 300px;
          background: #e9ecef;
          font-style: italic;
        }
      `}</style>
    </div>
  ) : <p>Loading...</p>;
}
