import React, { useState, useEffect } from "react";
import { fetchProductsByCategory } from '../api';  // Ensure this is correct
import "../styles/similar.css";

const SimilarProductsSection = ({ productId, category }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSimilarProducts = async () => {
      try {
        const products = await fetchProductsByCategory(category, productId);  // Fetch products by category and exclude the current product
        setSimilarProducts(products);
      } catch (error) {
        console.error("Error fetching similar products:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (category && productId) {
      loadSimilarProducts();
    }
  }, [category, productId]);  // The effect will rerun when the category or productId changes

  if (loading) {
    return <p>Loading similar products...</p>;
  }

  if (!similarProducts || similarProducts.length === 0) {
    return <p>No similar products found.</p>;
  }

  return (
    <section className="similar-products">
      <h3>Compare with Similar Products</h3>
      <div className="products-row-com">
        {similarProducts.map((product) => (
          <div className="product-card-com" key={product._id}>
            <img src={`https://rentez-w8lz.onrender.com/${product.images[0]}`} alt={product.name} />
            <h4>{product.name}</h4>
            <div className="txt">
              <p>{product.location}</p>
              <p>{product.rentalDays} days</p>
            </div>
            <div className="Price">
              <p className="price">₹{product.price} / Day</p>
              <button className="rent-now-bttn-com">Rent Now</button>
            </div>

            <div className="specifications">
              {product.specification && product.specification.length > 0 ? (
                product.specification.map((spec, index) => (
                  <p key={index}>{spec.key}: {spec.value}</p>
                ))
              ) : (
                <p>No specifications available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SimilarProductsSection;
