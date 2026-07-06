import { ArrowLeft, Star, BookOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { mockBooks } from "../data/mockData";
import BookCard from "../components/BookCard";

export default function BookDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const book = mockBooks.find((b) => b.id === Number(id));

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Book not found</p>
      </div>
    );
  }

  const relatedBooks = mockBooks
    .filter((b) => b.category === book.category && b.id !== book.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary p-6 pb-8 relative">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-40 h-56 bg-white rounded-2xl shadow-2xl overflow-hidden mb-4">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* Book Info Card */}
        <div className="bg-card rounded-3xl p-6 shadow-lg mb-6">
          <div className="text-center mb-4">
            <h1 className="font-bold text-xl mb-2">{book.title}</h1>
            <p className="text-muted-foreground">{book.author}</p>
          </div>

          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-lg">{book.rating}</span>
              </div>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
            <div className="h-12 w-px bg-border"></div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="font-semibold text-lg">
                  {book.availableCopies}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Publisher</span>
              <span className="font-medium">{book.publisher}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Year</span>
              <span className="font-medium">{book.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium">{book.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ISBN</span>
              <span className="font-medium">{book.isbn}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {book.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/borrow-confirmation/${book.id}`)}
              disabled={!book.available}
              className={`w-full py-4 rounded-2xl font-semibold transition-colors ${
                book.available
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {book.available ? "Borrow Book" : "Not Available"}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 rounded-2xl font-medium bg-card border border-border hover:bg-accent transition-colors">
                Reserve Book
              </button>
              <button className="py-3 rounded-2xl font-medium bg-card border border-border hover:bg-accent transition-colors" disabled>
                Favourite removed
              </button>
            </div>
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold text-lg mb-4">Related Books</h2>
            <div className="grid grid-cols-2 gap-4">
              {relatedBooks.map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
