// src/components/ApotekList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const ApotekList = () => {
  const [apoteks, setApoteks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mengambil data dari API Laravel
    axios
      .get("http://localhost:8000/api/apoteks")
      .then((response) => {
        setApoteks(response.data);  // Menyimpan data apotek ke state
        setLoading(false);           // Menghentikan loading
      })
      .catch((error) => {
        setError("Error fetching data"); // Menangani error
        setLoading(false);              // Menghentikan loading
      });
  }, []);  // Mengambil data hanya sekali saat komponen pertama kali dirender

  // Menampilkan loading atau error jika ada
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Daftar Apotek</h1>
      <ul>
        {apoteks.map((apotek) => (
          <li key={apotek.no}>
            <h2>{apotek.nama}</h2>
            <p>{apotek.alamat}</p>
            <p>Telp: {apotek.no_telp}</p>
            <p>Waktu Operasional: {apotek.waktu_operasional}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApotekList;
