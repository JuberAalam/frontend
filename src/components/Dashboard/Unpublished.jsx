import ImageSlider from "../common/ImageSlider";
export default function Unpublished({ products, onTogglePublish }) {
  if (!products || products.length === 0) {
    return <p>No Unpublished products</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
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

          {/* OPTIONAL: unpublish button */}
          <button
            className="unpublish-btn"
            onClick={() => onTogglePublish(product._id)}
          >
            Publish
          </button>
        </div>
      ))}
    </div>
  );
}
