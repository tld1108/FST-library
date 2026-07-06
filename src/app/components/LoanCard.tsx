interface LoanCardProps {
  bookTitle: string;
  bookCover: string;
  borrowDate: string;
  dueDate: string;
  status: "active" | "returned" | "overdue";
  onExtend?: () => void;
}

export default function LoanCard({
  bookTitle,
  bookCover,
  borrowDate,
  dueDate,
  status,
  onExtend,
}: LoanCardProps) {
  const statusColors = {
    active: "bg-primary/10 text-primary",
    returned: "bg-muted text-muted-foreground",
    overdue: "bg-destructive/10 text-destructive",
  };

  const statusLabels = {
    active: "Active",
    returned: "Returned",
    overdue: "Overdue",
  };

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="w-16 h-24 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-xl overflow-hidden flex-shrink-0">
          <img src={bookCover} alt={bookTitle} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">{bookTitle}</h3>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Borrowed: {borrowDate}</p>
            <p>Due: {dueDate}</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
              {statusLabels[status]}
            </span>
            {status === "active" && onExtend && (
              <button
                onClick={onExtend}
                className="text-xs text-primary font-medium hover:underline"
              >
                Extend
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
