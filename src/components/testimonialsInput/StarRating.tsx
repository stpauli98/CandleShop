import React from "react";
import { Star } from "lucide-react";
interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}
export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
}) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="focus:outline-none transform transition-transform duration-200 hover:scale-110"
        >
          <Star
            className={`w-6 h-6 ${star <= rating ? "fill-orange-400 text-orange-400" : "text-purple-200"}`}
          />
        </button>
      ))}
    </div>
  );
};
