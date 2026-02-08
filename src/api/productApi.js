// ===============================================
// UPDATED productApi.js - READY FOR RAILWAY
// Save this at: frontend/src/api/productApi.js
// ===============================================

// 🔥 IMPORTANT: Use environment variable instead of hardcoded localhost
const BASE_URL = 
  import.meta.env?.VITE_API_URL ||        // For Vite
  process.env.REACT_APP_API_URL ||        // For Create React App
  'http://localhost:5000';                // Fallback for local dev

const API_URL = `${BASE_URL}/api/products`;

console.log('🔌 Products API configured:', API_URL);

/* ================= GET ALL PRODUCTS ================= */
export const getProducts = async () => {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};

/* ================= CREATE PRODUCT ================= */
export const createProduct = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create product");
  }

  return res.json();
};

/* ================= UPDATE PRODUCT ================= */
export const updateProduct = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update product");
  }

  return res.json();
};

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }

  return res.json();
};

/* ================= PUBLISH / UNPUBLISH (FIXED ✅) ================= */
export const togglePublish = async (id) => {
  const res = await fetch(`${API_URL}/${id}/publish`, {
    method: "PATCH",
  });

  if (!res.ok) {
    throw new Error("Publish / Unpublish failed");
  }

  return res.json();
};