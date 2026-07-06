import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import BookCard from "../components/BookCard";
import { mockBooks } from "../data/mockData";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    author: "",
    year: "",
    availability: "",
  });

  const filteredBooks = mockBooks.filter((book) => {
    const matchesSearch =
      searchQuery === "" ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !filters.category || book.category === filters.category;
    const matchesAuthor =
      !filters.author ||
      book.author.toLowerCase().includes(filters.author.toLowerCase());
    const matchesYear = !filters.year || book.year.toString() === filters.year;
    const matchesAvailability =
      !filters.availability ||
      (filters.availability === "available" && book.available) ||
      (filters.availability === "borrowed" && !book.available);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesAuthor &&
      matchesYear &&
      matchesAvailability
    );
  });

  const clearFilters = () => {
    setFilters({
      category: "",
      author: "",
      year: "",
      availability: "",
    });
  };

  return (
    <div className="pb-20 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-b-3xl">
        <h1 className="text-white text-2xl font-bold mb-6">Search Books</h1>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search books, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-6 bg-card border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-primary text-sm font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full px-4 py-3 bg-input-background rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Engineering">Engineering</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">Availability</label>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      availability:
                        filters.availability === "available" ? "" : "available",
                    })
                  }
                  className={`flex-1 py-3 rounded-2xl font-medium transition-colors ${
                    filters.availability === "available"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border"
                  }`}
                >
                  Available
                </button>
                <button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      availability:
                        filters.availability === "borrowed" ? "" : "borrowed",
                    })
                  }
                  className={`flex-1 py-3 rounded-2xl font-medium transition-colors ${
                    filters.availability === "borrowed"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border"
                  }`}
                >
                  Borrowed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">
            {filteredBooks.length} Books Found
          </h2>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No Books Found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
