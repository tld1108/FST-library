import { Search, Beaker, Cpu, Calculator, Hammer, Code } from "lucide-react";
import { useNavigate } from "react-router";
import BookCard from "../components/BookCard";
import CategoryChip from "../components/CategoryChip";
import { mockBooks } from "../data/mockData";
import { useState } from "react";

export default function HomeScreen() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { icon: Beaker, label: "Science" },
    { icon: Cpu, label: "Technology" },
    { icon: Calculator, label: "Mathematics" },
    { icon: Hammer, label: "Engineering" },
    { icon: Code, label: "Computer Science" },
  ];

  const featuredBooks = mockBooks.filter((book) => book.rating >= 4.8).slice(0, 3);
  const popularBooks = mockBooks.slice(0, 4);

  return (
    <div className="pb-20 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-b-3xl">
        <div className="mb-6">
          <h2 className="text-white/80 text-sm mb-1">Hello, Student</h2>
          <h1 className="text-white text-2xl font-bold">Welcome Back</h1>
        </div>

        {/* Search Bar (redirect to login when not authenticated) */}
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-white rounded-2xl px-4 py-4 flex items-center gap-3 shadow-lg"
        >
          <Search className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground text-left flex-1">
            Search books, authors...
          </span>
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
          <h3 className="font-semibold text-lg mb-1">Discover Knowledge</h3>
          <p className="text-muted-foreground text-sm">
            Find thousands of academic books
          </p>
        </div>

        {/* Categories */}
        <div>
          <h2 className="font-bold text-lg mb-4">Categories</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <CategoryChip
                key={category.label}
                icon={category.icon}
                label={category.label}
                active={selectedCategory === category.label}
                onClick={() => setSelectedCategory(category.label)}
              />
            ))}
          </div>
        </div>

                    <div className="flex items-center bg-white rounded-2xl p-2 shadow-2xl max-w-2xl mx-auto">
                      <button
                        onClick={() => navigate("/login")}
                        className="w-full bg-white rounded-2xl px-4 py-4 flex items-center gap-3 shadow-lg"
                      >
                        <Search className="w-5 h-5 text-muted-foreground" />
                        <span className="text-muted-foreground text-left flex-1">Search books, authors...</span>
                      </button>
                    </div>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
                        {categories.map((category) => (
                          <CategoryChip
                            key={category.label}
                            icon={category.icon}
                            label={category.label}
                            active={selectedCategory === category.label}
                            onClick={() => navigate("/login")}
                          />
                        ))}
            >
              See All
            </button>
          </div>
            <div className="space-y-3">
            {popularBooks.map((book, index) => (
              <div
                key={book.id}
                onClick={() => navigate(`/login`)}
                className="bg-card rounded-2xl p-4 shadow-sm flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-24 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={book.coverImage}
                      <div className="grid grid-cols-2 gap-4">
                        {featuredBooks.map((book) => (
                          <button key={book.id} onClick={() => navigate("/login")}> 
                            <BookCard {...book} />
                          </button>
                        ))}
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {book.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        book.available
                          ? "bg-primary/10 text-primary"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {book.available ? "Available" : "Borrowed"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Recently Added</h2>
            <button
              onClick={() => navigate("/login")}
              className="text-primary text-sm font-medium"
            >
              See All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {mockBooks
              .filter((book) => book.year === 2024)
              .slice(0, 2)
              .map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
