import { User, BookOpen, Settings, HelpCircle, LogOut, ChevronRight, Edit } from "lucide-react";
import { useNavigate } from "react-router";

export default function ProfileScreen() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Edit, label: "Edit Profile", path: "/profile/edit" },
    { icon: BookOpen, label: "Loan History", path: "/loans" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "Help Center", path: "/help" },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="pb-20 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary p-6 pb-12 rounded-b-3xl">
        <h1 className="text-white text-2xl font-bold mb-8">Profile</h1>

        {/* Profile Info */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1 text-white">
            <h2 className="text-xl font-bold mb-1">Alex Johnson</h2>
            <p className="text-white/80 text-sm mb-1">Student ID: ST202400123</p>
            <p className="text-white/80 text-sm">Faculty of Science and Technology</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6">
        {/* Stats Card */}
        <div className="bg-card rounded-3xl p-6 shadow-lg mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary mb-1">12</p>
              <p className="text-xs text-muted-foreground">Books Read</p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-2xl font-bold text-primary mb-1">2</p>
              <p className="text-xs text-muted-foreground">Active Loans</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary mb-1">5</p>
              <p className="text-xs text-muted-foreground">Favorites</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-card rounded-3xl shadow-lg overflow-hidden mb-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => item.path && navigate(item.path)}
                className={`w-full flex items-center gap-4 p-4 hover:bg-accent transition-colors ${
                  index !== menuItems.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="flex-1 text-left font-medium">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-destructive/10 text-destructive rounded-2xl p-4 flex items-center justify-center gap-3 font-semibold hover:bg-destructive/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

        {/* App Version */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          FST Library App v1.0.0
        </p>
      </div>
    </div>
  );
}
