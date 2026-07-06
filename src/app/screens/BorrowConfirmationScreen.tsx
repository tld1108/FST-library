import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CheckCircle2, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { mockBooks } from "../data/mockData";

export default function BorrowConfirmationScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const book = mockBooks.find((b) => b.id === Number(id));

  const borrowDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleConfirm = () => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate("/loans");
    }, 2500);
  };

  if (!book) {
    return null;
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
          >
            <CheckCircle2 className="w-24 h-24 text-white mx-auto mb-6" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold text-white mb-3">Success!</h1>
            <p className="text-white/90 text-lg">Book borrowed successfully</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto pt-8">
        <h1 className="text-2xl font-bold mb-2">Confirm Borrow</h1>
        <p className="text-muted-foreground mb-8">
          Please review the details before confirming
        </p>

        {/* Book Summary */}
        <div className="bg-card rounded-3xl p-6 shadow-lg mb-6">
          <h2 className="font-semibold mb-4">Book Summary</h2>
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-28 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold line-clamp-2 mb-1">{book.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
              <p className="text-xs text-muted-foreground">{book.category}</p>
            </div>
          </div>

          {/* Borrow Details */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Borrow Date</p>
                <p className="font-semibold">{formatDate(borrowDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Due Date</p>
                <p className="font-semibold">{formatDate(dueDate)}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-2xl">
            <h3 className="font-semibold text-sm mb-2">Borrow Duration</h3>
            <p className="text-muted-foreground text-sm">
              You can keep this book for 30 days. Please return it before the due
              date to avoid late fees.
            </p>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-6">
          <h3 className="font-semibold text-sm mb-2">Important Notes</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Late returns may incur fines</li>
            <li>• You can extend your loan online</li>
            <li>• Maximum of 5 books can be borrowed at once</li>
            <li>• Keep the book in good condition</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-lg hover:bg-primary/90 transition-colors"
          >
            Confirm Borrow
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-4 bg-card border border-border rounded-2xl font-medium hover:bg-accent transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
