import React from "react";
import './About.css'; // Pastikan kamu mengimpor file CSS yang benar
import sigImage from '../assets/images/sig.png';// Sesuaikan dengan path dan nama gambar yang Anda simpan

function About() {
  return (
    <div className="about-container">
      <h1 className="about-title">Tentang Apotek Spotter</h1>
      <p className="about-description">
        Apotek Spotter adalah aplikasi berbasis peta yang dirancang untuk memudahkan masyarakat dalam mencari apotek terdekat di Provinsi Riau. Aplikasi ini memungkinkan pengguna untuk mencari dan menemukan apotek-apotek terdekat dengan menggunakan filter kecamatan, melihat informasi apotek lengkap seperti alamat, jam operasional, dan kontak yang dapat dihubungi. Kami bertujuan untuk memberikan kemudahan akses informasi apotek agar masyarakat dapat dengan mudah mendapatkan layanan kesehatan yang mereka butuhkan.
      </p>
      <div className="about-img-container">
      <img src={sigImage} alt="Sig" className="about-img" />

      </div>
      <h2 className="about-title">Tujuan Pembuatan Sistem</h2>
      <p className="about-description">
        Tujuan utama pembuatan sistem persebaran apotek di Pekanbaru adalah untuk memudahkan masyarakat dalam menemukan apotek terdekat. Dengan adanya sistem ini, masyarakat dapat dengan cepat mencari lokasi apotek berdasarkan posisi mereka saat ini. Selain itu, sistem ini juga menyediakan informasi mengenai apotek yang menawarkan layanan khusus, seperti apotek yang buka 24 jam. Dengan informasi yang akurat dan mudah diakses, diharapkan masyarakat dapat lebih cepat mendapatkan obat-obatan yang dibutuhkan, sehingga dapat meningkatkan efisiensi pelayanan kesehatan dan kualitas layanan yang diterima.
      </p>


  
        {/* Tambahkan lebih banyak anggota tim sesuai kebutuhan */}
    </div>
  );
}

export default About;
