// ─── ProductCard ──────────────────────────────────────────────────────────────
const CATEGORY_ICONS = {
  phone: "📱",
  tv: "📺",
  laptop: "💻",
};

const CATEGORY_GRADIENTS = {
  phone: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  tv: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  laptop: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
};

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`star ${i < full ? "full" : i === full && half ? "half" : "empty"}`}
        >
          ★
        </span>
      ))}
      <span className="rating-num">{rating}</span>
    </div>
  );
}

export function ProductCard({ product, index }) {
  const icon = CATEGORY_ICONS[product.category];
  const gradient = CATEGORY_GRADIENTS[product.category];

  return (
    <div className="product-card" style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}>
      <div className="card-visual" style={{ background: gradient }}>
        <span className="card-emoji">{icon}</span>
        <div className="card-category-badge">{product.category}</div>
      </div>

      <div className="card-body">
        <div className="card-brand">{product.brand}</div>
        <h3 className="card-name">{product.name}</h3>
        <p className="card-specs">{product.specs}</p>

        <div className="card-color">
          <span
            className="color-dot"
            title={product.color}
          />
          <span className="color-name">{product.color}</span>
        </div>

        <StarRating rating={parseFloat(product.rating)} />
        <div className="card-reviews">{product.reviews.toLocaleString()} reviews</div>
      </div>

      <div className="card-footer">
        <div className="card-price">${product.price.toLocaleString()}</div>
        <button className="card-btn">View Details</button>
      </div>
    </div>
  );
}
