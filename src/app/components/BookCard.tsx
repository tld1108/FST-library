import { Star } from "lucide-react";
import { Link } from "react-router";

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  rating: number;
  available: boolean;
  category?: string;
}

export default function BookCard({
  id,
  title,
  author,
  coverImage,
  rating,
  available,
  category,
}: BookCardProps) {
  return (
    <Link to={`/book/${id}`}>
      <div className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/20 rounded-xl mb-3 overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-semibold text-sm line-clamp-2 mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground mb-2">{author}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{rating}</span>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              available
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {available ? "Available" : "Borrowed"}
          </span>
        </div>
      </div>
    </Link>
  );
}
