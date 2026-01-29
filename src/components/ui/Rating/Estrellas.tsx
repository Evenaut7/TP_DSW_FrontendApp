import React from "react";
import { Star } from "lucide-react";

type StarRatingProps = {
  rating: number;
  reviews: number;
  max?: number;
};

const StarRating: React.FC<StarRatingProps> = ({ rating, reviews, max = 5 }) => {
  const stars = Array.from({ length: max }, (_, index) => index < rating);

  return (
    <div className="d-flex align-items-center gap-2">
      <div className="flex flex-row gap-1">
        {stars.map((isFilled, index) => (
          <Star
            key={index}
            fill={isFilled ? "#87533b" : "gray"}     
            stroke="none"                         
            className="w-7 h-7"
          />
        ))}
      </div>
      <span className="text-base text-gray-700">
        ({reviews} reseña{reviews !== 1 ? "s" : ""})
      </span>
    </div>
  );
};

export default StarRating;