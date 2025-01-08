import React, { useState, useEffect } from "react";
import axios from "axios";
import "ol/ol.css"; // Import CSS untuk OpenLayers
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Icon } from "ol/style";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About"; // Import About component
import { Route, Routes } from "react-router-dom"; // Import Route dan Routes untuk routing
import apotekIcon from "./assets/icons/apotek.png";
import './App.css';

function App() {
  const [apoteks, setApoteks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const [selectedApotek, setSelectedApotek] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [vectorSource, setVectorSource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // New state for the current page
  const [itemsPerPage] = useState(5); // Define how many items per page
  const [isModalOpen, setIsModalOpen] = useState(false); // untuk kontrol apakah modal terbuka atau tidak

  // Fetch data from API
  useEffect(() => {
    const fetchApoteks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/Apotek");
        setApoteks(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data: " + error.message);
        setLoading(false);
      }
    };
    fetchApoteks();
  }, []);

  // Filtered apotek untuk ditampilkan di sidebar
  const filteredApoteks = apoteks.filter((apotek) => {
    const matchesSearch = apotek.nama.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKecamatan = selectedKecamatan
      ? apotek.kecamatan.toLowerCase() === selectedKecamatan.toLowerCase()
      : true;
    return matchesSearch && matchesKecamatan;
  });

    // Pagination Logic
    const totalPages = Math.ceil(filteredApoteks.length / itemsPerPage);
    const indexOfLastApotek = currentPage * itemsPerPage;
    const indexOfFirstApotek = indexOfLastApotek - itemsPerPage;
    const currentApoteks = filteredApoteks.slice(indexOfFirstApotek, indexOfLastApotek);
  
    // Pagination Controls
    const nextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const prevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

  // Initialize Map
  useEffect(() => {
    if (apoteks.length > 0 && !map) {
      const initialMap = new Map({
        target: "map", // Target elemen dengan ID "map"
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([101.4475, 0.5333]), // Koordinat Provinsi Riau
          zoom: 12,
        }),
      });

      const initialVectorSource = new VectorSource();
      setVectorSource(initialVectorSource);

      const vectorLayer = new VectorLayer({
        source: initialVectorSource,
      });

      initialMap.addLayer(vectorLayer);
      setMap(initialMap);
    }
  }, [apoteks, map]);

  // Filter apoteks berdasarkan query pencarian dan kecamatan yang dipilih
  useEffect(() => {
    if (vectorSource) {
      vectorSource.clear();

      const filteredApoteks = apoteks.filter((apotek) => {
        const matchesSearch = apotek.nama.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesKecamatan = selectedKecamatan
          ? apotek.kecamatan.toLowerCase() === selectedKecamatan.toLowerCase()
          : true;
        return matchesSearch && matchesKecamatan;
      });

      filteredApoteks.forEach((apotek) => {
        const apotekCoords = [parseFloat(apotek.longitude), parseFloat(apotek.latitude)];
        const feature = new Feature({
          geometry: new Point(fromLonLat(apotekCoords)),
          apotekData: apotek,
        });

        feature.setStyle(
          new Style({
            image: new Icon({
              src: apotekIcon,
              scale: 0.07,
            }),
          })
        );
        vectorSource.addFeature(feature);
      });

      // Zoom ke apotek pertama yang terfilter jika ada
      if (filteredApoteks.length > 0) {
        const firstApotekCoords = [parseFloat(filteredApoteks[0].longitude), parseFloat(filteredApoteks[0].latitude)];
        map.getView().animate({
          center: fromLonLat(firstApotekCoords),
          zoom: 16,
          duration: 1000,
        });
      }
    }
  }, [searchQuery, selectedKecamatan, apoteks, vectorSource, map]);

  // Handle Klik pada Peta untuk menampilkan detail
  useEffect(() => {
    if (map) {
      map.on("click", (event) => {
        const feature = map.forEachFeatureAtPixel(event.pixel, (feat) => feat);
        if (feature) {
          const apotek = feature.get("apotekData");
          setSelectedApotek(apotek);
          setIsModalOpen(true);
          map.getView().animate({
            center: feature.getGeometry().getCoordinates(),
            zoom: 16,
            duration: 1000,
          });
        }
      });
    }
  }, [map]);

    const handleViewDetails = (apotek) => {
      setSelectedApotek(apotek);
      const apotekCoords = [parseFloat(apotek.longitude), parseFloat(apotek.latitude)];
      map.getView().animate({
        center: fromLonLat(apotekCoords),
        zoom: 16,
        duration: 1000,
      });
    };

    
  return (
    <div className="app-container bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <Routes>
        <Route path="/" element={
          <div className="flex flex-col md:flex-row w-full p-5">
            {/* Sidebar */}
            <div className="sidebar w-full md:w-1/3 bg-white p-6 shadow-lg rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Cari Apotek</h2>
              <input
                type="text"
                placeholder="Cari Apotek..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-full p-2 border rounded-lg mb-4"
              />
              <div>
                <label htmlFor="kecamatan" className="label text-sm font-medium text-gray-600 mb-2">Filter Kecamatan:</label>
                <select
                  id="kecamatan"
                  value={selectedKecamatan}
                  onChange={(e) => setSelectedKecamatan(e.target.value)}
                  className="select w-full p-2 border rounded-lg"
                >
                  <option value="">Semua Kecamatan</option>
                  {Array.from(new Set(apoteks.map((apotek) => apotek.kecamatan))).map((kecamatan, index) => (
                    <option key={index} value={kecamatan}>
                      {kecamatan}
                    </option>
                  ))}
                </select>
              </div>

              <h3 className="text-2xl font-bold mt-6">Daftar Apotek</h3>
              <ul className="list-none p-0">
                {currentApoteks.map((apotek) => (
                  <li key={apotek.id} className="mb-2">
                    <button
                      onClick={() => setSelectedApotek(apotek)}
                      className="w-full text-left p-2 text-gray-700 hover:bg-gray-200 rounded-lg"
                    >
                      {apotek.nama}
                    </button>
                    <button
                      onClick={() => handleViewDetails(apotek)}
                      className="w-full mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-232"
                    >
                      Lihat Apotek
                    </button>
                  </li>
                ))}
              </ul>
              <div className="pagination mt-4 flex justify-between items-center">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="btn py-2 px-4 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
                >
                  Prev
                </button>
                <span className="text-gray-700">
                  Bagian {currentPage} dari {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="btn py-2 px-4 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="content-container flex-1 ml-0 md:ml-6">
              <h1 className="title text-xl font-bold text-gray-800 mb-4">Persebaran Apotek di Kota Pekanbaru</h1>
              <div id="map" className="map-container w-full h-[500px] bg-gray-200 rounded-lg shadow-lg"></div>
            </div>
          </div>
        } />
        <Route path="/about" element={<About />} />
      </Routes>

      {/* Modal Popup untuk Detail Apotek */}
      {isModalOpen && selectedApotek && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h2 className="popup-title">{selectedApotek.nama}</h2>
            <p><strong>Alamat:</strong> {selectedApotek.alamat}</p>
            <p><strong>Kecamatan:</strong> {selectedApotek.kecamatan}</p>
            <p><strong>Waktu Operasional:</strong> {selectedApotek.waktu_operasional}</p>
            <p><strong>Nomor Telephone:</strong> {selectedApotek.no_telp}</p>
            <img 
              src={selectedApotek.foto} 
              alt={`Gambar Apotek ${selectedApotek.nama}`} 
              className="popup-image"
            />
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="popup-close-btn"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
