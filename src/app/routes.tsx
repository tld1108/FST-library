import { createBrowserRouter } from "react-router";
import Root from "./Root";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import BookDetailScreen from "./screens/BookDetailScreen";
import BorrowConfirmationScreen from "./screens/BorrowConfirmationScreen";
import LoansScreen from "./screens/LoansScreen";
// Notifications removed
import ProfileScreen from "./screens/ProfileScreen";
import AdminDashboard from "./screens/admin/AdminDashboard";
import AdminManageBooks from "./screens/admin/AdminManageBooks";
// Admin notifications & favorites removed
import AdminReports from "./screens/admin/AdminReports";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: SplashScreen },
      { path: "login", Component: LoginScreen },
      { path: "home", Component: HomeScreen },
      { path: "search", Component: SearchScreen },
      { path: "book/:id", Component: BookDetailScreen },
      { path: "borrow-confirmation/:id", Component: BorrowConfirmationScreen },
      { path: "loans", Component: LoansScreen },
      // notifications & favorites routes removed
      { path: "profile", Component: ProfileScreen },
      { path: "admin", Component: AdminDashboard },
      { path: "admin/books", Component: AdminManageBooks },
      { path: "admin/reports", Component: AdminReports },
    ],
  },
]);
