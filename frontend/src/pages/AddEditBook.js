import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';
import { useNavigate, useParams } from 'react-router-dom';
import { authHeader, getToken } from '../utils';

export default function AddEditBook() {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    year: ''
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  // ✅ Redirect to login if not authenticated
  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch book data if editing
  useEffect(() => {
    if (id) {
      axios.get(`${API_BASE}/books/${id}`).then(res => {
        setForm({
          title: res.data.book.title || '',
          author: res.data.book.author || '',
          description: res.data.book.description || '',
          genre: res.data.book.genre || '',
          year: res.data.book.year || ''
        });
        if (res.data.book.image) {
          setImage(res.data.book.image); // keep image path if it exists
        }
      }).catch(() => { });
    }
  }, [id]);

  // Handle form submission
  const submit = async (e) => {
    e.preventDefault();
    if (!getToken()) return navigate('/login');

    try {
      const data = new FormData();
      data.append('title', form.title.trim());
      data.append('author', form.author);
      data.append('description', form.description);
      data.append('genre', form.genre);
      data.append('year', form.year);

      if (image instanceof File) {
        data.append('image', image);
      }

      if (id) {
        // Update existing book
        await axios.put(`${API_BASE}/books/${id}`, data, {
          headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Add new book
        await axios.post(`${API_BASE}/books`, data, {
          headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/');
    } catch (e) {
      alert(e.response?.data?.message || 'Error saving book');
    }
  };

  return (
    <div className="col-md-8 offset-md-2">
      <h3>{id ? 'Edit' : 'Add'} Book</h3>
      <form onSubmit={submit} encType="multipart/form-data">
        
        <input
          className="form-control mb-2"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />

        <input
          className="form-control mb-2"
          placeholder="Author"
          value={form.author}
          onChange={e => setForm({ ...form, author: e.target.value })}
        />

        <input
          className="form-control mb-2"
          placeholder="Genre"
          value={form.genre}
          onChange={e => setForm({ ...form, genre: e.target.value })}
        />

        <input
          className="form-control mb-2"
          type="number"
          placeholder="Published Year"
          value={form.year}
          onChange={e => setForm({ ...form, year: e.target.value })}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <input
          className="form-control mb-2"
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
        />

        {/* Preview existing image if editing */}
        {typeof image === 'string' && (
          <img
            src={API_BASE.replace('/api', '') + image}
            alt="Book Cover"
            className="img-thumbnail mb-2"
            style={{ maxHeight: "200px" }}
          />
        )}

        <button className="btn btn-primary">
          {id ? 'Update' : 'Add'} Book
        </button>
      </form>
    </div>
  );
}
