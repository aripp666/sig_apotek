import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";

function Admin() {
  const [apoteks, setApoteks] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    kecamatan: "",
    latitude: "",
    longitude: "",
    waktu_operasional: "",
    no_telp: "",
    foto: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);


  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchApoteks();
  }, []);

  const fetchApoteks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/apoteks");
      setApoteks(response.data);
    } catch (error) {
      setError("Error fetching data: " + error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/apoteks/${editingId}`, formData);
        setNotification({ message: "Apotek updated successfully!", type: "success" });
      } else {
        await axios.post("http://localhost:8000/api/apoteks", formData);
        setNotification({ message: "Apotek added successfully!", type: "success" });
      }
      fetchApoteks();
      setFormData({
        nama: "",
        alamat: "",
        kecamatan: "",
        latitude: "",
        longitude: "",
        waktu_operasional: "",
        no_telp: "",
        foto: "",
      });
      setEditingId(null);
      setIsFormVisible(false); 
      setTimeout(() => setNotification(null), 3000); 
    } catch (error) {
      setError("Error creating or updating apotek: " + error.message);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleEdit = (apotek) => {
    setEditingId(apotek.id);
    setFormData(apotek);
    setIsFormVisible(true); 
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/apoteks/${id}`);
      setNotification({ message: "Apotek deleted successfully!", type: "success" });
      fetchApoteks();
      setTimeout(() => setNotification(null), 3000); 
    } catch (error) {
      setError("Error deleting apotek: " + error.message);
      setTimeout(() => setNotification(null), 3000);
    }
  };


  const filteredApoteks = apoteks.filter((apotek) =>
    apotek.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apotek.alamat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apotek.kecamatan.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const totalPages = Math.ceil(filteredApoteks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentApoteks = filteredApoteks.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin</h1>
      {error && <p className="error">{error}</p>}

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      

      <div className="toggle-buttons">
        <button
          onClick={() => setIsFormVisible(true)}
          className={`toggle-btn ${isFormVisible ? "active" : ""}`}
        >
          Show Form
        </button>
        <button
          onClick={() => setIsFormVisible(false)}
          className={`toggle-btn ${!isFormVisible ? "active" : ""}`}
        >
          Show Table
        </button>
      </div>

      {isFormVisible ? (
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="text"
            name="nama"
            placeholder="Nama Apotek"
            value={formData.nama}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="alamat"
            placeholder="Alamat"
            value={formData.alamat}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="kecamatan"
            placeholder="Kecamatan"
            value={formData.kecamatan}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="latitude"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="longitude"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="waktu_operasional"
            placeholder="Waktu Operasional"
            value={formData.waktu_operasional}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="no_telp"
            placeholder="No Telepon"
            value={formData.no_telp}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="foto"
            placeholder="URL Foto"
            value={formData.foto}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-submit">
            {editingId ? "Update Apotek" : "Add Apotek"}
          </button>
        </form>
      ) : (
        <div className="table-container">
            <input
        type="text"
        placeholder="Search Apotek..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Alamat</th>
                <th>Kecamatan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentApoteks.map((apotek) => (
                <tr key={apotek.id}>
                  <td>{apotek.nama}</td>
                  <td>{apotek.alamat}</td>
                  <td>{apotek.kecamatan}</td>
                  <td>
                    <button onClick={() => handleEdit(apotek)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(apotek.id)} className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
        </div>
      )}


    </div>
  );
}

export default Admin;
