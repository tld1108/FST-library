import { useState } from "react";
import { Search, SlidersHorizontal, Plus, Edit, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../../components/ui/dialog";
import AdminSidebar from "../../components/AdminSidebar";
import { mockBooks } from "../../data/mockData";
import { toast } from "sonner";

export default function AdminManageBooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    publisher: "",
    year: "",
    description: "",
  });
  const [booksState, setBooksState] = useState(() => mockBooks.slice());
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Book added successfully");
    setShowAddModal(false);
    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "",
      publisher: "",
      year: "",
      description: "",
    });
  };

  const handleDelete = (bookId: number) => {
    setDeleteTarget(bookId);
  };

  const confirmDelete = () => {
    if (deleteTarget == null) return;
    const book = booksState.find(b => b.id === deleteTarget);
    setBooksState((b) => b.filter((x) => x.id !== deleteTarget));
    setDeleteTarget(null);
    toast.success("Buku berhasil dihapus.", { description: book?.title });
  };

  const cancelDelete = () => setDeleteTarget(null);

  const filteredBooks = booksState.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Manage Books</h1>
              <p className="text-muted-foreground">
                {filteredBooks.length} books in library
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Book
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-card rounded-2xl p-4 mb-6 shadow-sm">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search books by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="px-4 py-3 bg-input-background rounded-xl border border-border hover:bg-accent transition-colors">
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Books Table */}
          <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold">Title</th>
                    <th className="text-left py-4 px-6 font-semibold">Author</th>
                    <th className="text-left py-4 px-6 font-semibold">Category</th>
                    <th className="text-left py-4 px-6 font-semibold">ISBN</th>
                    <th className="text-left py-4 px-6 font-semibold">Status</th>
                    <th className="text-left py-4 px-6 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book, index) => (
                    <tr
                      key={book.id}
                      className={
                        index !== filteredBooks.length - 1
                          ? "border-b border-border"
                          : ""
                      }
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{book.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {book.year}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">{book.author}</td>
                      <td className="py-4 px-6">{book.category}</td>
                      <td className="py-4 px-6 text-sm">{book.isbn}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            book.available
                              ? "bg-primary/10 text-primary"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {book.availableCopies}/{book.totalCopies} Available
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-primary" />
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Add New Book</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-10 h-10 hover:bg-accent rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBook} className="p-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm mb-2">
                  Book Title *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter book title"
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm mb-2">
                  Author *
                </label>
                <input
                  id="author"
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter author name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="isbn" className="block text-sm mb-2">
                    ISBN *
                  </label>
                  <input
                    id="isbn"
                    type="text"
                    required
                    value={formData.isbn}
                    onChange={(e) =>
                      setFormData({ ...formData, isbn: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="978-0-12-345678-9"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select category</option>
                    <option value="Science">Science</option>
                    <option value="Technology">Technology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="publisher" className="block text-sm mb-2">
                    Publisher *
                  </label>
                  <input
                    id="publisher"
                    type="text"
                    required
                    value={formData.publisher}
                    onChange={(e) =>
                      setFormData({ ...formData, publisher: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter publisher name"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm mb-2">
                    Publication Year *
                  </label>
                  <input
                    id="year"
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="2024"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Enter book description"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Upload Cover Image</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-accent transition-colors cursor-pointer">
                  <Plus className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Save Book
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 bg-card border border-border rounded-2xl font-medium hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Dialog using project Dialog component */}
      <Dialog open={deleteTarget != null} onOpenChange={(open) => { if (!open) cancelDelete(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Buku</DialogTitle>
            <DialogDescription>
              <p>Apakah Anda yakin ingin menghapus buku ini?</p>
              <p>Data buku yang sudah dihapus tidak dapat dikembalikan.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button onClick={cancelDelete} className="px-4 py-2 rounded-xl border border-border">Batal</button>
            <button onClick={confirmDelete} className="px-4 py-2 rounded-xl bg-red-600 text-white">Hapus</button>
          </DialogFooter>
          <DialogClose />
        </DialogContent>
      </Dialog>
    </div>
  );
}
