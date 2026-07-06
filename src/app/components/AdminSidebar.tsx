import { Home, BookOpen, Users, ClipboardList, RotateCcw, DollarSign, BarChart3, Settings, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useState } from "react";

export default function AdminSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: BookOpen, label: "Manage Books", path: "/admin/books" },
    { icon: Users, label: "Manage Members", path: "/admin/members" },
    { icon: ClipboardList, label: "Borrow Requests", path: "/admin/requests" },
    { icon: RotateCcw, label: "Returns", path: "/admin/returns" },
    { icon: DollarSign, label: "Fines", path: "/admin/fines" },
    { icon: BarChart3, label: "Reports", path: "/admin/reports" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-card border-r border-border z-40 transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 flex flex-col`}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold">FST Library</h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "hover:bg-accent text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            to="/home"
            className="block w-full px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium text-center hover:bg-primary/20 transition-colors"
          >
            Back to Library
          </Link>
        </div>
      </aside>
    </>
  );
}
