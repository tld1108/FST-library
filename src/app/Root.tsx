import { Outlet, useLocation } from "react-router";
import BottomNavigation from "./components/BottomNavigation";
import { Toaster } from "./components/ui/sonner";

export default function Root() {
  const location = useLocation();
  
  // Hide bottom navigation on splash, login, and admin screens
  const hideBottomNav = 
    location.pathname === "/" || 
    location.pathname === "/login" ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/borrow-confirmation");

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile container */}
      <div className="mx-auto max-w-[390px] min-h-screen bg-background relative">
        <Outlet />
        {!hideBottomNav && <BottomNavigation />}
      </div>
      <Toaster />
    </div>
  );
}