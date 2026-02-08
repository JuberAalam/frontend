import ImageSlider from "../common/ImageSlider";
import 
{ useEffect, useState } from "react";
import "./Products.css";
import AddProductModal from "./AddProductModal";

import {
  getProducts,
  deleteProduct,
  togglePublish,
} from "../../api/productApi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showToast, setShowToast] = useState(false);

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= FILTER ONLY UNPUBLISHED 🔥 ================= */
  const unpublishedProducts = products.filter(
    (product) => product.published === false
  );

  /* ================= ADD / UPDATE ================= */
  const handleAddSuccess = () => {
    setShowModal(false);
    setEditData(null);
    fetchProducts();

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  /* ================= EDIT ================= */
  const editProduct = (product) => {
    setEditData(product);
    setShowModal(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
    fetchProducts();
  };

  /* ================= PUBLISH ================= */
  const handlePublish = async (id) => {
    await togglePublish(id);
    fetchProducts(); // refresh list after publish
  };

  return (
    <div className="products-page">
      {/* HEADER */}
      <div className="products-header">
        <h3>Products</h3>
        <button onClick={() => setShowModal(true)}>
          + Add Product
        </button>
      </div>

      {/* EMPTY STATE */}
      {unpublishedProducts.length === 0 && (
        <div className="products-empty">
          <h3>No unpublished products</h3>
        </div>
      )}

      {/* PRODUCT GRID */}
      {unpublishedProducts.length > 0 && (
        <div className="product-grid">
          {unpublishedProducts.map((product) => (
            <div className="product-card" key={product._id}>
                <ImageSlider images={product.images} />

              <h4>{product.name}</h4>
              <p>Product Type - {product.type}</p>
              <p>Quantity Stock - {product.stock}</p>
              <p>MRP - ₹{product.mrp}</p>
              <p>Selling Price - ₹{product.sellingPrice}</p>
              <p>Brand Name - {product.brand}</p>
              <p>Total Number of Images - {product.images?.length || 0}</p>
              <p>Exchange Eligibility - {product.exchange ? "Yes" : "No"}</p>

             
              <div className="product-actions">
                <button
                  className="publish-btn"
                  onClick={() => handlePublish(product._id)}
                >
                  Publish
                </button>

                <button
                  className="edit-btn"
                  onClick={() => editProduct(product)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(product._id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <AddProductModal
          editData={editData}
          onClose={() => {
            setShowModal(false);
            setEditData(null);
          }}
          onSuccess={handleAddSuccess}
        />
      )}

      {/* TOAST */}
      {showToast && (
        <div className="toast">
          ✅ Product saved successfully
        </div>
      )}
    </div>
  );
}
