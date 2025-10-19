import "./ReviewCard.css"; 

function ReviewCard({ reviewer, game, image, rating, text, likes }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push(<i key={i} className="bi bi-star-fill text-danger"></i>);
    else if (i === Math.ceil(rating) && rating % 1 !== 0) stars.push(<i key={i} className="bi bi-star-half text-danger"></i>);
    else stars.push(<i key={i} className="bi bi-star text-danger"></i>);
  }

  return (
    <div className="card review-card h-100 p-3">
      <div className="row g-0">
        
        <div className="col-auto">
          <img src={image} alt={game} className="review-img me-3" />
        </div>
        
        <div className="col d-flex flex-column">
          
          <p className="mb-1 review-info-line"> 
            <strong>{reviewer}</strong> publicou uma review em <strong>{game}</strong>
          </p>
          
          <div className="mb-2 review-stars">
            {stars}
          </div>
          
          <p className="review-text mb-2">{text}</p>
          
          <div className="d-flex align-items-center mt-auto review-likes">
            <i className="bi bi-heart-fill text-danger me-1 ms-5 ps-5"></i>
            <span className= "ms-3">{likes}</span>
          </div>

        </div> 
      </div> 
    </div> 
  );
}

export default ReviewCard;