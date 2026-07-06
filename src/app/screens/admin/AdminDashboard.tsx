import { BookOpen, Users, TrendingUp, CheckCircle, Clock } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import { Link } from "react-router";
import { mockBooks, mockLoans } from "../../data/mockData";

export default function AdminDashboard() {
  const stats = [
    {
      icon: BookOpen,
      label: "Total Books",
      value: "1,234",
      change: "+12%",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      label: "Active Loans",
      value: "89",
      change: "+5%",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: CheckCircle,
      label: "Returned Today",
      value: "23",
      change: "+8%",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Users,
      label: "Registered Members",
      value: "567",
      change: "+15%",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  const recentActivity = [
    { id: 1, user: "John Doe", action: "Borrowed", book: "Introduction to Quantum Physics", time: "10 mins ago" },
    { id: 2, user: "Jane Smith", action: "Returned", book: "Modern Software Engineering", time: "25 mins ago" },
    { id: 3, user: "Mike Johnson", action: "Reserved", book: "Advanced Calculus", time: "1 hour ago" },
    { id: 4, user: "Sarah Williams", action: "Borrowed", book: "Classical Mechanics", time: "2 hours ago" },
    { id: 5, user: "Tom Brown", action: "Returned", book: "Algorithms and Data Structures", time: "3 hours ago" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Admin</p>
            </div>
            {/* notifications removed */}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-card rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <span className="text-sm font-medium text-primary">{stat.change}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <button className="bg-primary text-white rounded-2xl p-6 text-left hover:bg-primary/90 transition-colors">
              <BookOpen className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg mb-1">Add New Book</h3>
              <p className="text-sm text-white/80">Add a book to the library</p>
            </button>
            <button className="bg-secondary text-secondary-foreground rounded-2xl p-6 text-left hover:bg-secondary/90 transition-colors">
              <Users className="w-8 h-8 mb-3" />
              <h3 className="font-semibold text-lg mb-1">Register Member</h3>
              <p className="text-sm text-foreground/70">Add a new library member</p>
            </button>
            <button className="bg-card border border-border rounded-2xl p-6 text-left hover:bg-accent transition-colors">
              <Clock className="w-8 h-8 mb-3 text-primary" />
              <h3 className="font-semibold text-lg mb-1">Process Return</h3>
              <p className="text-sm text-muted-foreground">Handle book returns</p>
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-bold text-xl">Recent Activity</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-sm">User</th>
                    <th className="text-left py-3 px-6 font-medium text-sm">Action</th>
                    <th className="text-left py-3 px-6 font-medium text-sm">Book</th>
                    <th className="text-left py-3 px-6 font-medium text-sm">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((activity, index) => (
                    <tr
                      key={activity.id}
                      className={index !== recentActivity.length - 1 ? "border-b border-border" : ""}
                    >
                      <td className="py-4 px-6">{activity.user}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            activity.action === "Borrowed"
                              ? "bg-primary/10 text-primary"
                              : activity.action === "Returned"
                              ? "bg-green-50 text-green-600"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {activity.action}
                        </span>
                      </td>
                      <td className="py-4 px-6 max-w-xs truncate">{activity.book}</td>
                      <td className="py-4 px-6 text-muted-foreground text-sm">{activity.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
