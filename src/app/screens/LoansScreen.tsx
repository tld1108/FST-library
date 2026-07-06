import { useState } from "react";
import LoanCard from "../components/LoanCard";
import { mockLoans } from "../data/mockData";
import { toast } from "sonner";

export default function LoansScreen() {
  const [activeTab, setActiveTab] = useState<"active" | "returned" | "overdue">("active");

  const activeLoansList = mockLoans.filter((loan) => loan.status === "active");
  const returnedLoansList = mockLoans.filter((loan) => loan.status === "returned");
  const overdueLoansList = mockLoans.filter((loan) => loan.status === "overdue");

  const handleExtend = (loanId: number) => {
    toast.success("Loan extended successfully", {
      description: "Due date has been extended by 14 days",
    });
  };

  const getLoansList = () => {
    switch (activeTab) {
      case "active":
        return activeLoansList;
      case "returned":
        return returnedLoansList;
      case "overdue":
        return overdueLoansList;
      default:
        return [];
    }
  };

  const currentLoans = getLoansList();

  return (
    <div className="pb-20 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-b-3xl">
        <h1 className="text-white text-2xl font-bold mb-6">My Loans</h1>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/20 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
              activeTab === "active"
                ? "bg-white text-primary"
                : "text-white"
            }`}
          >
            Active ({activeLoansList.length})
          </button>
          <button
            onClick={() => setActiveTab("returned")}
            className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
              activeTab === "returned"
                ? "bg-white text-primary"
                : "text-white"
            }`}
          >
            Returned ({returnedLoansList.length})
          </button>
          <button
            onClick={() => setActiveTab("overdue")}
            className={`flex-1 py-2 rounded-xl font-medium transition-colors ${
              activeTab === "overdue"
                ? "bg-white text-destructive"
                : "text-white"
            }`}
          >
            Overdue ({overdueLoansList.length})
          </button>
        </div>
      </div>

      {/* Loans List */}
      <div className="p-6">
        {currentLoans.length > 0 ? (
          <div className="space-y-4">
            {currentLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                bookTitle={loan.bookTitle}
                bookCover={loan.bookCover}
                borrowDate={loan.borrowDate}
                dueDate={loan.dueDate}
                status={loan.status}
                onExtend={
                  loan.status === "active"
                    ? () => handleExtend(loan.id)
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">
              {activeTab === "active" && "No Active Loans"}
              {activeTab === "returned" && "No Returned Books"}
              {activeTab === "overdue" && "No Overdue Books"}
            </h3>
            <p className="text-muted-foreground text-sm">
              {activeTab === "active" &&
                "Start borrowing books from our library"}
              {activeTab === "returned" && "You haven't returned any books yet"}
              {activeTab === "overdue" && "Great! All your books are on time"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
