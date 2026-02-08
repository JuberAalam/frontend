import { useEffect, useState } from "react";
import "./Dashboard.css";

import { getProducts, togglePublish } from "../../api/productApi";
import Published from "./Published";
import Unpublished from "./Unpublished";
import Products from "../Products/Products";

export default function Dashboard() {
  const [page, setPage] = useState("dashboard"); // dashboard | products
  const [activeTab, setActiveTab] = useState("published");
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= SEARCH FILTER ================= */
  const filteredProducts = products.filter((product) => {
    const text = search.toLowerCase();

    return (
      product.name?.toLowerCase().includes(text) ||
      product.brand?.toLowerCase().includes(text) ||
      product.type?.toLowerCase().includes(text)
    );
  });

  /* ================= PUBLISH FILTER ================= */
  const publishedProducts = filteredProducts.filter(
    (product) => product.published === true
  );

  const unpublishedProducts = filteredProducts.filter(
    (product) => product.published === false
  );

  /* ================= TOGGLE PUBLISH ================= */
  const handleTogglePublish = async (id) => {
    await togglePublish(id);
    fetchProducts();
  };

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h3 className="logo">Product</h3>

        <input
          className="search"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <nav>
          <p
            className={page === "dashboard" ? "active" : ""}
            onClick={() => setPage("dashboard")}
          >
            Home
          </p>

          <p
            className={page === "products" ? "active" : ""}
            onClick={() => setPage("products")}
          >
            Products
          </p>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        {page === "dashboard" && (
          <>
            <div className="top-bar">
              <span
                className={`tab ${activeTab === "published" ? "active" : ""}`}
                onClick={() => setActiveTab("published")}
              >
                Published
              </span>

              <span
                className={`tab ${activeTab === "unpublished" ? "active" : ""}`}
                onClick={() => setActiveTab("unpublished")}
              >
                Unpublished
              </span>
            </div>

            {activeTab === "published" && (
              <Published
                products={publishedProducts}
                onTogglePublish={handleTogglePublish}
              />
            )}

            {activeTab === "unpublished" && (
              <Unpublished
                products={unpublishedProducts}
                onTogglePublish={handleTogglePublish}
              />
            )}
          </>
        )}

        {page === "products" && <Products />}
      </main>
    </div>
  );
}
