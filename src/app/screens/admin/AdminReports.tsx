import AdminSidebar from "../../components/AdminSidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export default function AdminReports() {
  const monthlyBorrowData = [
    { month: "Jan", borrows: 120 },
    { month: "Feb", borrows: 150 },
    { month: "Mar", borrows: 180 },
    { month: "Apr", borrows: 165 },
    { month: "May", borrows: 200 },
    { month: "Jun", borrows: 210 },
  ];

  const mostBorrowedBooks = [
    { title: "Quantum Physics", count: 45 },
    { title: "Software Engineering", count: 38 },
    { title: "Advanced Calculus", count: 32 },
    { title: "Classical Mechanics", count: 28 },
    { title: "Data Structures", count: 25 },
  ];

  const categoryData = [
    { name: "Science", value: 35 },
    { name: "Technology", value: 25 },
    { name: "Mathematics", value: 20 },
    { name: "Engineering", value: 15 },
    { name: "Computer Science", value: 5 },
  ];

  const COLORS = ["#2E7D32", "#81C784", "#66BB6A", "#4CAF50", "#A5D6A7"];

  const summaryCards = [
    { label: "Total Borrows This Month", value: "210", trend: "+12%" },
    { label: "Active Members", value: "567", trend: "+8%" },
    { label: "Books Added This Month", value: "45", trend: "+20%" },
    { label: "Average Rating", value: "4.7", trend: "+0.2" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Library statistics and insights
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {summaryCards.map((card) => (
              <div key={card.label} className="bg-card rounded-2xl p-6 shadow-sm">
                <p className="text-muted-foreground text-sm mb-2">{card.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-3xl font-bold">{card.value}</h3>
                  <span className="text-sm font-medium text-primary">
                    {card.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Borrow Statistics */}
            <div className="bg-card rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-xl mb-6">Monthly Borrow Statistics</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyBorrowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                    }}
                  />
                  <Bar dataKey="borrows" fill="#2E7D32" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="bg-card rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-xl mb-6">Category Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Most Borrowed Books */}
          <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-bold text-xl">Most Borrowed Books</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mostBorrowedBooks.map((book, index) => (
                  <div key={book.title} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-600"
                          : index === 1
                          ? "bg-gray-100 text-gray-600"
                          : index === 2
                          ? "bg-orange-100 text-orange-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{book.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{book.count}</p>
                      <p className="text-xs text-muted-foreground">borrows</p>
                    </div>
                    <div className="w-48 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(book.count / 45) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
