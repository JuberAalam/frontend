import { useEffect, useState } from "react";
import "./AddProductModal.css";
import { createProduct, updateProduct } from "../../api/productApi";

export default function AddProductModal({ onClose, onSuccess, editData }) {
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    type: "",
    stock: "",
    mrp: "",
    sellingPrice: "",
    brand: "",
    exchange: true,
  });

  /* ================= PREFILL DATA (EDIT MODE) ================= */
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        type: editData.type || "",
        stock: editData.stock || "",
        mrp: editData.mrp || "",
        sellingPrice: editData.sellingPrice || "",
        brand: editData.brand || "",
        exchange: editData.exchange ?? true,
      });

      setImages(editData.images?.map((url) => ({ url })) || []);
    }
  }, [editData]);

  /* ================= IMAGE UPLOAD (BASE64 – BEST FOR DEMO) ================= */
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    const base64Images = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    );

    setImages((prev) => [
      ...prev,
      ...base64Images.map((url) => ({ url })),
    ]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.name || images.length === 0) {
      alert("Product name and images are required");
      return;
    }

    const payload = {
      ...form,
      stock: Number(form.stock),
      mrp: Number(form.mrp),
      sellingPrice: Number(form.sellingPrice),
      images: images.map((img) => img.url), // Base64 strings
    };

    try {
      if (editData) {
        await updateProduct(editData._id, payload);
      } else {
        await createProduct(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* HEADER */}
        <div className="modal-header">
          <h3>{editData ? "Edit Product" : "Add Product"}</h3>
          <span className="close" onClick={onClose}>
            ×
          </span>
        </div>

        {/* BODY */}
        <div className="modal-body">
          <label>Product Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label>Product Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="">Select</option>
            <option>Foods</option>
            <option>Electronics</option>
            <option>Clothes</option>
            <option>Beauty Products</option>
            <option>Others</option>
          </select>

          <label>Stock</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <label>MRP</label>
          <input
            type="number"
            value={form.mrp}
            onChange={(e) => setForm({ ...form, mrp: e.target.value })}
          />

          <label>Selling Price</label>
          <input
            type="number"
            value={form.sellingPrice}
            onChange={(e) =>
              setForm({ ...form, sellingPrice: e.target.value })
            }
          />

          <label>Brand</label>
          <input
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />

          {/* IMAGES */}
          <label>Images</label>
          <div className="upload-wrapper">
            {images.map((img, i) => (
              <div className="img-preview" key={i}>
                <img src={img.url} alt="preview" />
                <span onClick={() => removeImage(i)}>×</span>
              </div>
            ))}

            <label className="upload-box">
              Browse
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* EXCHANGE */}
          <label>Exchange</label>
          <select
            value={form.exchange ? "Yes" : "No"}
            onChange={(e) =>
              setForm({ ...form, exchange: e.target.value === "Yes" })
            }
          >
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="create-btn" onClick={handleSubmit}>
            {editData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
