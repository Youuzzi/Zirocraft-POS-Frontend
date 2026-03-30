import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import "./CategoryList.css";

const CategoryList = ({ onSelect, active }) => {
  const { categories } = useContext(AppContext);

  return (
    <div className="category-section">
      <h5 className="text-secondary mb-3 ms-1">Select Category</h5>
      <div className="category-scroll-container">
        <div
          className={`category-card ${active === "All" ? "active" : ""}`}
          onClick={() => onSelect("All")}
        >
          <div className="cat-icon">
            <i className="bi bi-grid-fill"></i>
          </div>
          <span className="cat-name">All</span>
        </div>

        {categories.map((cat) => (
          <div
            key={cat.categoryId || cat.id}
            className={`category-card ${active === cat.name ? "active" : ""}`}
            onClick={() => onSelect(cat.name)}
          >
            <div className="cat-icon">
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
