import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import "./CategoryList.css";

const CategoryList = () => {
  const { categories } = useContext(AppContext);

  return (
    <div className="category-section">
      <h5 className="text-secondary mb-3 ms-1">Select Category</h5>
      <div className="category-scroll-container">
        {/* 1. Tombol ALL (Default) */}
        <div className="category-card active">
          <div className="cat-icon">
            <i className="bi bi-grid-fill"></i>
          </div>
          <span className="cat-name">All</span>
        </div>

        {/* 2. Mapping Kategori dari Database */}
        {categories.map((cat) => (
          <div key={cat.categoryId || cat.id} className="category-card">
            <div className="cat-icon">
              {/* LOGIKA GAMBAR: Cek URL Backend */}
              {cat.imgUrl ? (
                <img
                  src={`http://localhost:8080/api/v1.0${cat.imgUrl}`}
                  alt={cat.name}
                />
              ) : (
                <i className="bi bi-tag-fill"></i>
              )}
            </div>
            <span className="cat-name">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
