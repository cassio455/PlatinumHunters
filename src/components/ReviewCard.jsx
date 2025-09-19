import "./ReviewCard.css"; 

function ReviewCard({ reviewer, game, image, rating, text, likes }) {
  // Create an array to render filled stars
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push(<i key={i} className="bi bi-star-fill text-danger"></i>);
    else if (i === Math.ceil(rating) && rating % 1 !== 0) stars.push(<i key={i} className="bi bi-star-half text-danger"></i>);
    else stars.push(<i key={i} className="bi bi-star text-danger"></i>);
  }

  return (
    <div className="card review-card h-100 p-3">
      <div className="d-flex align-items-center mb-2">
        <img src={image} alt={game} className="review-img me-2" />
        <p className="mb-0 text-nowrap"><strong>{reviewer}</strong> publicou uma review em <p><strong>{game}</strong></p></p>
      </div>

      <div className="mb-2">
        {stars}
      </div>

      <p className="review-text">{text}</p>

      <div className="d-flex align-items-center mt-2">
        <i className="bi bi-heart-fill text-danger me-1"></i>
        <span>{likes}</span>
      </div>
    </div>
  );
}

export default ReviewCard;
