import React, { useState } from "react";
import {
  Search, BookOpen, Star, Clock, ChevronRight, ChevronLeft,
  Filter, Grid3X3, List, Plus, Edit2, Trash2, BarChart2,
  Users, LogOut, Menu, X, Eye, EyeOff, Lock,
  ArrowRight, Calendar, GraduationCap, Download,
  CheckCircle, AlertTriangle, BookMarked,
  FileText, RefreshCw, ChevronDown, MapPin, Mail, Phone,
  DollarSign, RotateCcw, Check, Upload, Save, Settings,
  Activity
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./components/ui/dialog";
import { toast } from "sonner";
import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import uinLogo from "@/imports/image.png";

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
type Page =
  | "landing" | "login"
  | "dashboard" | "catalog" | "book-detail"
  | "ebook" | "borrow-form" | "borrow-success"
  | "return-form" | "loans" | "notifications" | "profile"
  | "admin-dashboard" | "admin-books" | "admin-members"
  | "admin-loans" | "admin-reports" | "admin-settings" | "admin-notifications";

interface Book {
  id: string; title: string; author: string; category: string;
  rating: number; available: number; total: number; isbn: string;
  publisher: string; year: number; pages: number; description: string;
  cover: string; language: string; edition: string;
}

interface Loan {
  id: string; bookId: string; bookJudul: string; bookPenulis: string;
  bookCover: string; borrowDate: string; dueDate: string;
  returnDate?: string; status: "aktif" | "dikembalikan" | "terlambat";
  fine?: number;
}

interface Notification {
  id: string; type: "due" | "terlambat" | "available" | "new" | "confirm" | "fine";
  title: string; message: string; date: string; read: boolean;
}

interface Anggota {
  id: string; name: string; studentId: string; email: string;
  department: string; activeLoans: number; totalLoans: number;
  joinDate: string; status: "active" | "ditangguhkan";
  membershipExpiry?: string;
}

// ─────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────
const books: Book[] = [
  {
    id: "1", title: "Introduction to Algorithms", author: "Thomas H. Cormen",
    category: "Teknik Informatika", rating: 4.8, available: 3, total: 5,
    isbn: "978-0-262-03384-8", publisher: "MIT Press", year: 2022, pages: 1312,
    description: "A comprehensive introduction to modern computer algorithms. It presents many algorithms and covers them in considerable depth, yet makes their design and analysis accessible to all levels dari readers. The fourth edition includes a new chapter on multithreading and covers randomized algorithms throughout.",
    cover: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=420&fit=crop&auto=format",
    language: "Inggris", edition: "4th Edisi"
  },
  {
    id: "2", title: "Calculus: Early Transcendentals", author: "James Stewart",
    category: "Matematika", rating: 4.6, available: 2, total: 6,
    isbn: "978-1-285-74155-0", publisher: "Cengage Learning", year: 2020, pages: 1368,
    description: "Stewart's Calculus is widely renowned for its mathematical precision and outstanding exercises. This text has a proven reputation for excellent accuracy and comprehensive exercises that develop students' problem-solving skills.",
    cover: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=420&fit=crop&auto=format",
    language: "Inggris", edition: "9th Edisi"
  },
  {
    id: "3", title: "Fisika for Scientists and Engineers", author: "Raymond Serway",
    category: "Fisika", rating: 4.5, available: 0, total: 4,
    isbn: "978-1-337-55329-5", publisher: "Cengage Learning", year: 2021, pages: 1408,
    description: "A modern, comprehensive ringkasan dari classical and modern physics with a concise yet thorough treatment dari the principles dari physics. Features clear problem-solving methodology and real-world applications.",
    cover: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=300&h=420&fit=crop&auto=format",
    language: "Inggris", edition: "10th Edisi"
  },
  {
    id: "4", title: "Molecular Biologi dari the Cell", author: "Bruce Alberts",
    category: "Biologi", rating: 4.7, available: 1, total: 3,
    isbn: "978-0-393-88482-1", publisher: "W. W. Norton", year: 2022, pages: 1342,
    description: "The leading cell biology textbook, known for clear writing and exceptional illustrations. Provides a comprehensive ringkasan dari cellular structures and processes with extensive coverage dari molecular mechanisms.",
    cover: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=420&fit=crop&auto=format",
    language: "Inggris", edition: "7th Edisi"
  },
  {
    id: "5", title: "Organic Kimia", author: "Paula Yurkanis Bruice",
    category: "Kimia", rating: 4.4, available: 4, total: 5,
    isbn: "978-0-134-97445-3", publisher: "Pearson", year: 2019, pages: 1264,
    description: "Focuses on bantuaning students understand the relationship between structure and reactivity. Modern and relevant, it bridges the gap between organic chemistry concepts and biological applications.",
    cover: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&h=420&fit=crop&auto=format",
    language: "Inggris", edition: "8th Edisi"
  },
  {
    id: "6", title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell",
    category: "Teknik Informatika", rating: 4.9, available: 2, total: 4,
    isbn: "978-0-134-61096-6", publisher: "Pearson", year: 2021, pages: 1132,
    description: "The leading AI textbook, used in over 1500 universities worldwide. Covers the full breadth dari AI including search, knowledge representation, planning, machine learning, neural networks, and modern AI applications.",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=420&fit=crop&auto=format",
    language: "Inggris", edition: "4th Edisi"
  },
  {
    id: "7", title: "Linear Algebra and Its Applications", author: "David C. Lay",
    category: "Matematika", rating: 4.5, available: 3, total: 5,
    isbn: "978-0-321-98238-4", publisher: "Pearson", year: 2022, pages: 576,
    description: "With traditional linear algebra content, the text makes abstract concepts concrete through a focus on modern applications and numerical computations. Ideal for undergraduates in STEM fields.",
    cover: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=420&fit=crop&auto=format",
    language: "Inggris", edition: "6th Edisi"
  },
  {
    id: "8", title: "Data Structures and Algorithm Analysis", author: "Mark Allen Weiss",
    category: "Teknik Informatika", rating: 4.6, available: 1, total: 3,
    isbn: "978-0-132-57627-7", publisher: "Pearson", year: 2020, pages: 640,
    description: "Continues to refine an innovative approach to algorithms and data structures. Balancing theoretical knowledge with practical implementation, this text is essential for CS students.",
    cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=420&fit=crop&auto=format",
    language: "Inggris", edition: "2nd Edisi"
  },
  {
    id: "9", title: "Ilmu Lingkungan", author: "Daniel Botkin",
    category: "Ilmu Lingkungan", rating: 4.3, available: 5, total: 6,
    isbn: "978-0-321-97711-6", publisher: "Pearson", year: 2021, pages: 608,
    description: "Helps students understand humanity's relationship with the natural world, focusing on solutions to environmental problems and covering current environmental issues with scientific rigor.",
    cover: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=420&fit=crop&auto=format",
    language: "Inggris", edition: "9th Edisi"
  },
  {
    id: "10", title: "Fundamentals dari Electrical Teknik", author: "Charles A. Gross",
    category: "Teknik", rating: 4.4, available: 2, total: 4,
    isbn: "978-1-420-08567-4", publisher: "CRC Press", year: 2019, pages: 460,
    description: "A comprehensive introduction to electrical engineering covering circuit analysis, electronics, digital circuits, signals and systems, and power systems with practical lab exercises.",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=420&fit=crop&auto=format",
    language: "Inggris", edition: "1st Edisi"
  },
  {
    id: "11", title: "The Elements dari Statistical Learning", author: "Trevor Hastie",
    category: "Statistika", rating: 4.7, available: 0, total: 3,
    isbn: "978-0-387-84858-7", publisher: "Springer", year: 2023, pages: 745,
    description: "Comprehensive introduction to the statistical methodology dari machine learning. Covers supervised and unsupervised learning, neural networks, support vector machines, and more with mathematical rigor.",
    cover: "https://images.unsplash.com/photo-1580894912989-0bc892f4efd0?w=300&h=420&fit=crop&auto=format",
    language: "Inggris", edition: "12th Edisi"
  },
  {
    id: "12", title: "Engineering Mathematics", author: "K.A. Stroud",
    category: "Matematika", rating: 4.5, available: 6, total: 8,
    isbn: "978-1-137-03120-4", publisher: "Palgrave Macmillan", year: 2020, pages: 1184,
    description: "A groundbreaking and comprehensive reference with over 500,000 copies sold. The seventh edition includes new chapters on numerical methods, Laplace transforms, and Fourier analysis.",
    cover: "https://images.unsplash.com/photo-1489769002049-ccd828976a6c?w=300&h=420&fit=crop&auto=format",
    language: "Inggris", edition: "Edisi ke-7"
  }
];

const islamicBooks: Book[] = [
  {
    id: "I01", title: "Riyadhus Shalihin", author: "Imam An-Nawawi",
    category: "Buku Islam", rating: 5.0, available: 4, total: 6,
    isbn: "978-979-592-314-0", publisher: "Pustaka Ibnu Katsir", year: 2021, pages: 896,
    description: "Kumpulan hadits-hadits pilihan yang disusun Imam An-Nawawi sebagai panduan hidup Muslim. Memuat hadits shahih dari Al-Quran dan Sunnah tentang akhlak, ibadah, muamalah, dan berbagai aspek kehidupan seorang Muslim.",
    cover: "https://images.unsplash.com/photo-1588344093894-84efcf2720f3?w=300&h=420&fit=crop&auto=format",
    language: "Arab / Indonesia", edition: "Edisi Lengkap"
  },
  {
    id: "I02", title: "Tafsir Ibnu Katsir", author: "Ibnu Katsir",
    category: "Buku Islam", rating: 4.9, available: 2, total: 4,
    isbn: "978-979-592-001-9", publisher: "Pustaka Imam Asy-Syafi'i", year: 2022, pages: 4800,
    description: "Tafsir Al-Quran paling komprehensif dan terpercaya karya Imam Ibnu Katsir. Menjelaskan makna ayat-ayat Al-Quran berdasarkan riwayat yang shahih dari Nabi, sahabat, dan tabi'in. Edisi lengkap 8 jilid.",
    cover: "https://images.unsplash.com/photo-1609656036445-e3f158ca97d5?w=300&h=420&fit=crop&auto=format",
    language: "Arab / Indonesia", edition: "Edisi Lengkap 8 Jilid"
  },
  {
    id: "I03", title: "Fiqih Islam Wa Adillatuhu", author: "Prof. Dr. Wahbah Az-Zuhaili",
    category: "Buku Islam", rating: 4.8, available: 3, total: 5,
    isbn: "978-979-29-1151-4", publisher: "Gema Insani", year: 2020, pages: 6200,
    description: "Ensiklopedi fiqih Islam terlengkap yang membahas seluruh aspek hukum Islam secara sistematis dan komprehensif. Disertai dalil-dalil dari Al-Quran, Hadits, dan pendapat para ulama mazhab.",
    cover: "https://images.unsplash.com/photo-1624357824434-27d181804b20?w=300&h=420&fit=crop&auto=format",
    language: "Arab / Indonesia", edition: "Edisi Terjemah"
  },
  {
    id: "I04", title: "Sirah Nabawiyah", author: "Syaikh Shafiyyurrahman Al-Mubarakfuri",
    category: "Buku Islam", rating: 4.9, available: 5, total: 7,
    isbn: "978-979-592-181-8", publisher: "Pustaka Al-Kautsar", year: 2021, pages: 640,
    description: "Ar-Rahiq Al-Makhtum — pemenang Hadiah Pertama Rabithah Al-Alam Al-Islami. Kisah lengkap perjalanan hidup Rasulullah ﷺ dari kelahiran hingga wafat, ditulis berdasarkan sumber-sumber yang shahih dan terpercaya.",
    cover: "https://images.unsplash.com/photo-1576764402988-7143f9cca90a?w=300&h=420&fit=crop&auto=format",
    language: "Arab / Indonesia", edition: "Edisi Revisi"
  },
  {
    id: "I05", title: "Ihya Ulumuddin", author: "Imam Al-Ghazali",
    category: "Buku Islam", rating: 4.8, available: 2, total: 4,
    isbn: "978-979-8557-28-7", publisher: "Marja", year: 2019, pages: 3200,
    description: "Karya monumental Imam Al-Ghazali yang membahas ilmu syariat, hati, dan jiwa. Mengupas tuntas aspek lahir dan batin dalam beribadah kepada Allah, menjadi salah satu kitab tasawuf paling berpengaruh sepanjang masa.",
    cover: "https://images.unsplash.com/photo-1597505495109-7fc35bb64d8e?w=300&h=420&fit=crop&auto=format",
    language: "Arab / Indonesia", edition: "Edisi Lengkap 4 Jilid"
  },
  {
    id: "I06", title: "Al-Wafi: Syarah Hadits Arbain An-Nawawi", author: "Dr. Musthafa Dieb Al-Bugha",
    category: "Buku Islam", rating: 4.7, available: 6, total: 8,
    isbn: "978-979-3536-56-5", publisher: "Al-I'tishom", year: 2020, pages: 412,
    description: "Penjelasan mendalam 42 hadits pilihan yang menjadi pondasi ajaran Islam. Setiap hadits dibahas dari segi sanad, matan, dan pelajaran yang dapat dipetik untuk kehidupan seorang Muslim.",
    cover: "https://images.unsplash.com/photo-1589462135796-2b46e4bdd7fe?w=300&h=420&fit=crop&auto=format",
    language: "Arab / Indonesia", edition: "Edisi ke-3"
  },
  {
    id: "I07", title: "Zaadul Ma'ad", author: "Ibnul Qayyim Al-Jauziyyah",
    category: "Buku Islam", rating: 4.8, available: 1, total: 3,
    isbn: "978-979-592-421-5", publisher: "Pustaka Al-Kautsar", year: 2021, pages: 3600,
    description: "Bekal menuju akhirat — kitab komprehensif tentang sunnah Nabi dalam beribadah, bergaul, berperang, dan mengobati penyakit. Salah satu karya terbaik Ibnul Qayyim yang mencakup fiqih, hadits, dan akhlak.",
    cover: "https://images.unsplash.com/photo-1616422840391-fa670d4b2ae7?w=300&h=420&fit=crop&auto=format",
    language: "Arab / Indonesia", edition: "Edisi Lengkap 5 Jilid"
  },
  {
    id: "I08", title: "Tazkiyatun Nafs", author: "Dr. Ahmad Farid",
    category: "Buku Islam", rating: 4.6, available: 4, total: 5,
    isbn: "978-979-592-088-0", publisher: "Darul Haq", year: 2022, pages: 480,
    description: "Panduan lengkap pensucian jiwa berdasarkan Al-Quran dan Sunnah. Membahas penyakit-penyakit hati, cara penyembuhannya, dan jalan menuju jiwa yang tenang, bersih, dan dekat kepada Allah.",
    cover: "https://images.unsplash.com/photo-1575645513913-c002ea3b2e01?w=300&h=420&fit=crop&auto=format",
    language: "Arab / Indonesia", edition: "Edisi Revisi"
  },
];

const loans: Loan[] = [
  {
    id: "L001", bookId: "1", bookJudul: "Introduction to Algorithms",
    bookPenulis: "Thomas H. Cormen",
    bookCover: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=420&fit=crop&auto=format",
    borrowDate: "2026-06-10", dueDate: "2026-07-10", status: "aktif"
  },
  {
    id: "L002", bookId: "6", bookJudul: "Artificial Intelligence: A Modern Approach",
    bookPenulis: "Stuart Russell",
    bookCover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=420&fit=crop&auto=format",
    borrowDate: "2026-06-01", dueDate: "2026-06-22", status: "terlambat", fine: 14
  },
  {
    id: "L003", bookId: "4", bookJudul: "Molecular Biologi dari the Cell",
    bookPenulis: "Bruce Alberts",
    bookCover: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=420&fit=crop&auto=format",
    borrowDate: "2026-05-15", dueDate: "2026-06-15", returnDate: "2026-06-14", status: "dikembalikan"
  },
  {
    id: "L004", bookId: "2", bookJudul: "Calculus: Early Transcendentals",
    bookPenulis: "James Stewart",
    bookCover: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=420&fit=crop&auto=format",
    borrowDate: "2026-05-01", dueDate: "2026-06-01", returnDate: "2026-05-28", status: "dikembalikan"
  },
  {
    id: "L005", bookId: "7", bookJudul: "Linear Algebra and Its Applications",
    bookPenulis: "David C. Lay",
    bookCover: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=420&fit=crop&auto=format",
    borrowDate: "2026-06-20", dueDate: "2026-07-20", status: "aktif"
  }
];

// notifications removed

const members: Anggota[] = [
  { id: "M001", name: "Ahmad Firdaus", studentId: "A22EC0001", email: "ahmad.firdaus@mhs.uinjkt.ac.id", department: "Teknik Informatika", activeLoans: 3, totalLoans: 24, joinDate: "2022-09-01", status: "active", membershipExpiry: "2024-09-01" },
  { id: "M002", name: "Siti Nurhaliza", studentId: "A22EC0052", email: "siti.nurhaliza@graduate.uinjkt.ac.id", department: "Matematika", activeLoans: 1, totalLoans: 18, joinDate: "2022-09-01", status: "active", membershipExpiry: "2024-09-01" },
  { id: "M003", name: "Raj Kumar", studentId: "A23EC0103", email: "raj.kumar@graduate.uinjkt.ac.id", department: "Fisika", activeLoans: 2, totalLoans: 9, joinDate: "2023-09-01", status: "active", membershipExpiry: "2025-09-01" },
  { id: "M004", name: "Lee Wei Xian", studentId: "A22EC0078", email: "lee.weixian@graduate.uinjkt.ac.id", department: "Teknik", activeLoans: 0, totalLoans: 31, joinDate: "2022-09-01", status: "active", membershipExpiry: "2024-09-01" },
  { id: "M005", name: "Nurul Ain", studentId: "A23EC0155", email: "nurul.ain@graduate.uinjkt.ac.id", department: "Biologi", activeLoans: 4, totalLoans: 12, joinDate: "2023-09-01", status: "ditangguhkan", membershipExpiry: "2024-09-01" },
  { id: "M006", name: "Chen Jing Hao", studentId: "A24EC0024", email: "chen.jinghao@graduate.uinjkt.ac.id", department: "Teknik Informatika", activeLoans: 2, totalLoans: 5, joinDate: "2024-09-01", status: "active", membershipExpiry: "2026-09-01" },
];

const monthlyData = [
  { month: "Jan", borrows: 145, returns: 132, newAnggota: 12 },
  { month: "Feb", borrows: 132, returns: 128, newAnggota: 8 },
  { month: "Mar", borrows: 178, returns: 165, newAnggota: 15 },
  { month: "Apr", borrows: 156, returns: 170, newAnggota: 10 },
  { month: "May", borrows: 192, returns: 178, newAnggota: 18 },
  { month: "Jun", borrows: 168, returns: 155, newAnggota: 14 },
];

const categoryData = [
  { name: "Teknik Informatika", value: 42, color: "#003087" },
  { name: "Matematika", value: 28, color: "#1565C0" },
  { name: "Fisika", value: 18, color: "#90CAF9" },
  { name: "Biologi", value: 22, color: "#FFC107" },
  { name: "Kimia", value: 15, color: "#FF8F00" },
  { name: "Teknik", value: 20, color: "#BBDEFB" },
];

const topBukus = [
  { title: "Introduction to Algorithms", borrows: 48, author: "Cormen" },
  { title: "AI: A Modern Approach", borrows: 42, author: "Russell" },
  { title: "Calculus: Early Transcendentals", borrows: 39, author: "Stewart" },
  { title: "Organic Kimia", borrows: 35, author: "Bruice" },
  { title: "Molecular Biologi dari the Cell", borrows: 31, author: "Alberts" },
];

const recentActivity = [
  { action: "Buku dipinjam", detail: "Ahmad Firdaus borrowed \"Introduction to Algorithms\"", time: "2 mins ago", type: "borrow" },
  { action: "Buku dikembalikan", detail: "Siti Nurhaliza dikembalikan \"Calculus: Early Transcendentals\"", time: "15 mins ago", type: "return" },
  { action: "Anggota baru", detail: "Raj Kumar mendaftar sebagai anggota baru", time: "1 hour ago", type: "member" },
  { action: "Denda dibayar", detail: "Lee Wei Xian paid denda Rp8.000", time: "2 hours ago", type: "fine" },
  { action: "Buku direservasi", detail: "Chen Jing Hao reserved \"Fisika for Scientists\"", time: "3 hours ago", type: "reserve" },
];

const categories = ["Semua", "Buku Islam", "Teknik Informatika", "Matematika", "Fisika", "Biologi", "Kimia", "Teknik", "Statistika", "Ilmu Lingkungan"];

// ─────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────
function cn(...classes: (string | undefined | boolean | null)[]) {
  return classes.filter(Boolean).join(" ");
}

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.22, ease: "easeOut" }
};

// ─────────────────────────────────────────
// REUSABLE COMPONENTS
// ─────────────────────────────────────────
type BadgeVariant = "default" | "success" | "warning" | "error" | "info";
function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: BadgeVariant }) {
  const styles: Record<BadgeVariant, string> = {
    default: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", styles[variant])}>
      {children}
    </span>
  );
}

type BtnVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type BtnSize = "sm" | "md" | "lg";
function Btn({ children, onClick, variant = "primary", size = "md", className = "", disabled = false }: {
  children: React.ReactNode; onClick?: () => void;
  variant?: BtnVariant; size?: BtnSize; className?: string; disabled?: boolean;
}) {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none shrink-0";
  const sizes: Record<BtnSize, string> = { sm: "px-3 py-1.5 text-xs gap-1.5", md: "px-5 py-2.5 text-sm gap-2", lg: "px-7 py-3.5 text-base gap-2.5" };
  const variants: Record<BtnVariant, string> = {
    primary: "bg-[#003087] text-white hover:bg-[#002060] shadow-md hover:shadow-lg aktif:scale-[0.98]",
    secondary: "bg-[#1565C0] text-white hover:bg-[#0D47A1] shadow-sm hover:shadow-md aktif:scale-[0.98]",
    outline: "border-2 border-[#003087] text-[#003087] hover:bg-[#003087] hover:text-white aktif:scale-[0.98]",
    ghost: "text-[#003087] hover:bg-[#003087]/10 aktif:scale-[0.98]",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm aktif:scale-[0.98]",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={cn(base, sizes[size], variants[variant], disabled && "opacity-50 cursor-not-allowed", className)}>
      {children}
    </button>
  );
}

function InputField({ label, type = "text", placeholder, value, onChange, icon: Icon, rightIcon }: {
  label?: string; type?: string; placeholder?: string; value: string;
  onChange: (v: string) => void; icon?: React.ElementType; rightIcon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-semibold text-foreground">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />}
        <input
          type={type} placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          className={cn(
            "w-full rounded-xl border border-border bg-white text-foreground text-sm py-3 pr-4 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087] placeholder:text-muted-foreground",
            Icon ? "pl-10" : "pl-4"
          )}
        />
        {rightIcon && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightIcon}</div>}
      </div>
    </div>
  );
}

function StarPenilaian({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={cn("w-3.5 h-3.5", i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function KetersediaanBadge({ available, total }: { available: number; total: number }) {
  if (available === 0) return <Badge variant="error">Tidak Tersedia</Badge>;
  if (available <= 2) return <Badge variant="warning">{available} tersisa</Badge>;
  return <Badge variant="success">{available}/{total} Tersedia</Badge>;
}

function ToggleSwitch({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(!on)} className={cn("w-11 h-6 rounded-full transition-colors relative shrink-0", on ? "bg-[#003087]" : "bg-gray-200")}>
      <span className={cn("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all", on ? "tersisa-[22px]" : "tersisa-0.5")} />
    </button>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(!open)} className="bg-white rounded-2xl border border-border shadow-sm p-4 text-tersisa w-full hover:border-[#003087]/30 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-foreground">{question}</span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform shrink-0", open && "rotate-180")} />
      </div>
      {open && <p className="text-sm text-muted-foreground mt-3 leading-relaxed border-t border-border pt-3">{answer}</p>}
    </button>
  );
}

// ─────────────────────────────────────────
// LAYOUT: TOP NAV
// ─────────────────────────────────────────
function TopNav({ navigate, currentPage, unreadCount }: {
  navigate: (p: Page) => void; currentPage: Page; unreadCount: number;
}) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const navLinks: { label: string; page: Page }[] = [
    { label: "Beranda", page: "dashboard" },
    { label: "Katalog", page: "catalog" },
    { label: "Pinjaman Saya", page: "loans" },
  ];
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button onClick={() => navigate("dashboard")} className="flex items-center gap-2.5 shrink-0">
          <ImageWithFallback src={uinLogo} alt="Logo UIN Jakarta" className="w-11 h-11 object-contain drop-shadow-sm" />
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-[#003087] leading-tight">Perpustakaan UIN Jakarta</div>
            <div className="text-[11px] text-muted-foreground leading-tight">UIN Syarif Hidayatullah Jakarta</div>
          </div>
        </button>
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, page }) => (
            <button key={page} onClick={() => navigate(page)}
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                currentPage === page ? "bg-[#003087] text-white shadow-sm" : "text-muted-foreground hover:text-[#003087] hover:bg-[#003087]/10"
              )}>
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("profile")} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#003087]/10 transition-colors">
            <div className="w-8 h-8 bg-[#003087] rounded-xl flex items-center justify-center">
              <span className="text-white text-xs font-bold">AF</span>
            </div>
          </button>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-xl hover:bg-[#003087]/10 text-muted-foreground transition-colors">
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {mobileMenu && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ label, page }) => (
            <button key={page} onClick={() => { navigate(page); setMobileMenu(false); }}
              className={cn("w-full text-tersisa px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                currentPage === page ? "bg-[#003087] text-white" : "text-muted-foreground hover:bg-[#003087]/10 hover:text-[#003087]"
              )}>
              {label}
            </button>
          ))}
          <button onClick={() => { navigate("login"); setMobileMenu(false); }}
            className="w-full text-tersisa px-4 py-2.5 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-50 transition-colors">
            Portal Admin
          </button>
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────
// LAYOUT: ADMIN SIDEBAR
// ─────────────────────────────────────────
const adminNavItems: { icon: React.ElementType; label: string; page: Page }[] = [
  { icon: BarChart2, label: "Dasbor", page: "admin-dashboard" },
  { icon: BookOpen, label: "Buku", page: "admin-books" },
  { icon: Users, label: "Anggota", page: "admin-members" },
  { icon: BookMarked, label: "Pinjaman", page: "admin-loans" },
  { icon: FileText, label: "Laporan", page: "admin-reports" },
  { icon: Settings, label: "Pengaturan", page: "admin-settings" },
];

function AdminSidebar({ navigate, currentPage }: { navigate: (p: Page) => void; currentPage: Page }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside className={cn("flex flex-col bg-[#003087] min-h-screen transition-all duration-300 shadow-xl shrink-0", collapsed ? "w-16" : "w-60")}>
      <div className={cn("flex items-center h-16 px-3 border-b border-white/10", collapsed ? "justify-center" : "gap-3 justify-between")}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <ImageWithFallback src={uinLogo} alt="Logo UIN Jakarta" className="w-10 h-10 object-contain shrink-0" />
            <div className="min-w-0">
              <div className="text-white text-xs font-bold leading-tight truncate">Perpustakaan UIN Jakarta</div>
              <div className="text-white/60 text-[10px] leading-tight">Portal Admin</div>
            </div>
          </div>
        )}
        {collapsed && <ImageWithFallback src={uinLogo} alt="Logo UIN Jakarta" className="w-9 h-9 object-contain" />}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors shrink-0">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
        {adminNavItems.map(({ icon: Icon, label, page }) => {
          const aktif = currentPage === page;
          return (
            <button key={page} onClick={() => navigate(page)}
              className={cn("flex items-center rounded-xl py-2.5 transition-all duration-200 text-sm font-medium w-full",
                collapsed ? "justify-center px-2" : "gap-3 px-3",
                aktif ? "bg-white/20 text-white shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
              title={collapsed ? label : undefined}>
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </nav>
      <div className={cn("border-t border-white/10 p-2", collapsed && "flex justify-center")}>
        {!collapsed ? (
          <button onClick={() => navigate("landing")}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm font-medium">
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Keluar Admin</span>
          </button>
        ) : (
          <button onClick={() => navigate("landing")} className="p-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}

function AdminLayout({ children, navigate, currentPage, title, subtitle }: {
  children: React.ReactNode; navigate: (p: Page) => void; currentPage: Page; title: string; subtitle?: string;
}) {
  return (
    <div className="flex min-h-screen bg-[#F4F7FF]">
      <AdminSidebar navigate={navigate} currentPage={currentPage} />
      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        <div className="sticky top-0 z-40 bg-white border-b border-border px-6 h-16 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="w-8 h-8 bg-[#003087] rounded-xl flex items-center justify-center">
                <span className="text-white text-xs font-bold">AD</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-foreground">Pengguna Admin</div>
                <div className="text-xs text-muted-foreground">Pustakawan</div>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE: LANDING
// ─────────────────────────────────────────
function LandingPage({ navigate }: { navigate: (p: Page) => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { label: "Total Buku", value: "12,840", icon: BookOpen },
    { label: "Anggota Aktif", value: "3,210", icon: Users },
    { label: "Buku Dipinjam", value: "847", icon: BookMarked },
    { label: "Departemen", value: "12", icon: GraduationCap },
  ];

  const featuredCategories = [
    { name: "Buku Islam", count: 840, bg: "from-[#001A4E] to-[#003087]", emoji: "☪️" },
    { name: "Teknik Informatika", count: 2840, bg: "from-[#003087] to-[#0D47A1]", emoji: "💻" },
    { name: "Matematika", count: 1920, bg: "from-[#0D47A1] to-[#1565C0]", emoji: "📐" },
    { name: "Fisika", count: 1540, bg: "from-[#4A148C] to-[#6A1B9A]", emoji: "⚛️" },
    { name: "Biologi", count: 1280, bg: "from-[#BF360C] to-[#D84315]", emoji: "🧬" },
    { name: "Teknik", count: 2200, bg: "from-[#37474F] to-[#455A64]", emoji: "⚙️" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#001A4E] via-[#003087] to-[#004DB3] text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -tersisa-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#F5B800]/15 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-[#F5B800]/5 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <ImageWithFallback src={uinLogo} alt="Logo UIN Jakarta" className="w-12 h-12 object-contain drop-shadow-md" />
              <div>
                <div className="font-bold text-white leading-tight">Perpustakaan UIN Jakarta</div>
                <div className="text-white/70 text-xs leading-tight">UIN Syarif Hidayatullah Jakarta</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("login")} className="hidden sm:block text-white/80 hover:text-white text-sm font-medium transition-colors">
                Portal Admin
              </button>
              <Btn onClick={() => navigate("login")} className="!bg-white !text-[#003087] hover:!bg-white/90">
                Masuk
              </Btn>
            </div>
          </nav>

          <div className="max-w-3xl mx-auto text-center pb-28">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur rounded-full text-sm text-white/90 font-medium mb-6">
              <span className="w-2 h-2 bg-[#F5B800] rounded-full animate-pulse" />
              Perpustakaan UIN Jakarta
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Temukan. Pelajari.
              <span className="block text-[#F5B800]">Raih Prestasi.</span>
            </h1>
            <p className="text-xl text-white/80 mb-10 leading-relaxed max-w-xl mx-auto">
              Akses lebih dari 12.000 buku, jurnal, dan sumber digital untuk mendukung perjalanan akademik Anda.
            </p>
            <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && navigate("login")}
                placeholder="Cari berdasarkan judul, penulis, ISBN, atau kategori..."
                className="flex-1 pl-12 pr-3 py-2.5 text-foreground text-sm bg-transparent focus:outline-none placeholder:text-muted-foreground"
              />
              <Btn onClick={() => navigate("login")} size="md">Cari</Btn>
            </div>
            <div className="flex items-center justify-center gap-3 mt-4 text-white/60 text-sm flex-wrap">
              <span>Populer:</span>
              {["Algorithms", "Calculus", "Machine Learning", "Fisika"].map(q => (
                <button key={q} onClick={() => navigate("login")} className="hover:text-white transition-colors underline underline-darifset-2">{q}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 tersisa-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80L60 72C120 64 240 48 360 44C480 40 600 48 720 52C840 56 960 56 1080 48C1200 40 1320 24 1380 16L1440 8V80H0Z" fill="#F4F7FF" />
          </svg>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-[#F4F7FF] pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-border shadow-sm flex items-center gap-4">
                <div className="w-11 h-11 bg-[#003087]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#003087]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{value}</div>
                  <div className="text-xs text-muted-foreground font-medium">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[#F4F7FF] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Jelajahi Berdasarkan Kategori</h2>
              <p className="text-muted-foreground text-sm mt-1">Jelajahi koleksi kami lintas disiplin ilmu</p>
            </div>
            <Btn onClick={() => navigate("login")} variant="outline" size="sm">
              Lihat All <ArrowRight className="w-4 h-4" />
            </Btn>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {featuredCategories.map(({ name, count, bg, emoji }) => (
              <button key={name} onClick={() => navigate("login")}
                className={cn("relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br text-white text-tersisa hover:scale-[1.04] transition-transform duration-200 shadow-md hover:shadow-xl", bg)}>
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="text-xs font-bold leading-tight">{name}</div>
                <div className="text-white/70 text-xs mt-0.5">{count.toLocaleString()} books</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Buku Unggulan */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Buku Unggulan</h2>
              <p className="text-muted-foreground text-sm mt-1">Paling banyak dipinjam semester ini</p>
            </div>
            <Btn onClick={() => navigate("login")} variant="ghost" size="sm">
              See all <ChevronRight className="w-4 h-4" />
            </Btn>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {books.slice(0, 6).map(book => (
              <button key={book.id} onClick={() => navigate("login")} className="group text-tersisa">
                <div className="relative overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300 bg-gray-100 aspect-[3/4]">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {book.available === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold bg-red-500 px-2 py-0.5 rounded-full">Tidak Tersedia</span>
                    </div>
                  )}
                </div>
                <div className="mt-2.5">
                  <div className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">{book.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{book.author.split(" ").slice(-1)[0]}</div>
                  <StarPenilaian rating={book.rating} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Seksi Buku Islami */}
      <section className="bg-[#F4F7FF] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#003087] to-[#F5B800] rounded-2xl flex items-center justify-center text-2xl shadow-md">☪️</div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Koleksi Buku Islami</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Literatur Islam pilihan — tafsir, hadits, fiqih & sirah</p>
              </div>
            </div>
            <button onClick={() => navigate("login")} className="text-sm text-[#003087] font-semibold hover:underline flex items-center gap-1">
              Lihat semua <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Banner hero islami */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#001A4E] via-[#003087] to-[#0D47A1] p-8 mb-6 text-white shadow-xl">
            <div className="absolute -right-6 -top-6 text-[160px] opacity-10 select-none leading-none">☪️</div>
            <div className="relative max-w-lg">
              <span className="text-xs font-bold text-[#F5B800] uppercase tracking-widest">Koleksi Unggulan Perpustakaan</span>
              <h3 className="text-2xl font-bold mt-2 mb-3">Literatur Islam Klasik & Kontemporer</h3>
              <p className="text-white/75 text-sm leading-relaxed mb-5">Karya-karya ulama besar seperti Imam An-Nawawi, Ibnu Katsir, Al-Ghazali, dan Ibnul Qayyim tersedia untuk mendukung kajian keislaman sivitas akademika UIN Jakarta.</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">{islamicBooks.length} judul tersedia</span>
                <span className="text-xs bg-[#F5B800] text-[#001A4E] font-bold px-3 py-1.5 rounded-full">Koleksi Lengkap</span>
              </div>
            </div>
          </div>

          {/* Grid buku */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {islamicBooks.map(book => (
              <button key={book.id} onClick={() => navigate("login")} className="group text-left">
                <div className="relative overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300 bg-gray-100 aspect-[3/4]">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-1.5 left-1.5">
                    <span className="text-[9px] font-bold bg-[#F5B800] text-[#001A4E] px-1.5 py-0.5 rounded-full">☪</span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">{book.title}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{book.author}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-[#003087] to-[#1565C0] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Siap Mulai Belajar?</h2>
          <p className="text-white/80 text-lg mb-8">Masuk dengan akun mahasiswa UIN Jakarta untuk meminjam buku dan mengakses semua layanan perpustakaan.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Btn onClick={() => navigate("login")} size="lg" className="!bg-white !text-[#003087] hover:!bg-white/90 shadow-xl">
              <GraduationCap className="w-5 h-5" /> Masuk Mahasiswa
            </Btn>
            <Btn onClick={() => navigate("login")} variant="outline" size="lg" className="!border-white !text-white hover:!bg-white/10">
              Portal Admin
            </Btn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#001A4E] text-white/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <ImageWithFallback src={uinLogo} alt="Logo UIN Jakarta" className="w-10 h-10 object-contain" />
                <span className="text-white font-bold">Perpustakaan UIN Jakarta</span>
              </div>
              <p className="text-sm leading-relaxed mb-4">Universitas Islam Negeri Syarif Hidayatullah Jakarta. Mendukung pengetahuan dan pembelajaran sejak 1957.</p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Jl. Ir. H. Juanda No.95, Ciputat, Tangerang Selatan</div>
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> perpustakaan@uinjkt.ac.id</div>
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +6221-7401925</div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Tautan Cepat</h4>
              <ul className="flex flex-col gap-2 text-sm">
                {["Katalog", "E-Bukus", "Jurnal", "Basis Data", "Bantuan Riset"].map(l => (
                  <li key={l}><button onClick={() => navigate("login")} className="hover:text-white transition-colors">{l}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Services</h4>
              <ul className="flex flex-col gap-2 text-sm">
                {["Peminjaman Buku", "Reservasi", "Perpanjangan", "Pinjam Antar Perpustakaan", "Ruang Belajar"].map(l => (
                  <li key={l}><span className="hover:text-white cursor-pointer transition-colors">{l}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-xs text-center">
            © 2026 UIN Syarif Hidayatullah Jakarta · Perpustakaan Pusat UIN Jakarta
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE: LOGIN
// ─────────────────────────────────────────
type Role = "mahasiswa" | "dosen" | "admin";

const roleConfig: Record<Role, {
  label: string; idLabel: string; idPlaceholder: string; emailPlaceholder: string;
  icon: string; desc: string; dest: Page;
}> = {
  mahasiswa: {
    label: "Mahasiswa", idLabel: "NIM", idPlaceholder: "cth. 11220910000123",
    emailPlaceholder: "cth. ahmad@mhs.uinjkt.ac.id",
    icon: "🎓", desc: "Akses katalog & pinjam buku", dest: "dashboard",
  },
  dosen: {
    label: "Dosen", idLabel: "NIP", idPlaceholder: "cth. 197501012005011001",
    emailPlaceholder: "cth. dr.mahmud@uinjkt.ac.id",
    icon: "👨‍🏫", desc: "Akses koleksi & referensi penelitian", dest: "dashboard",
  },
  admin: {
    label: "Admin", idLabel: "NITK", idPlaceholder: "cth. 202001012024031001",
    emailPlaceholder: "cth. admin@uinjkt.ac.id",
    icon: "🛡️", desc: "Kelola sistem perpustakaan", dest: "admin-dashboard",
  },
};

function LoginPage({ navigate }: { navigate: (p: Page) => void }) {
  const [role, setRole] = useState<Role>("mahasiswa");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cfg = roleConfig[role];

  const handleRoleChange = (r: Role) => {
    setRole(r); setError(""); setIdNumber(""); setEmail(""); setPassword("");
  };

  const handleLogin = () => {
    if (!idNumber) { setError(`Harap masukkan ${cfg.idLabel} Anda.`); return; }
    if (!email || !password) { setError("Harap masukkan email dan kata sandi."); return; }
    setLoading(true); setError("");
    setTimeout(() => { setLoading(false); navigate(cfg.dest); }, 1200);
  };

  const sidebarInfo: Record<Role, { title: string; sub: string; stats: { label: string; value: string }[] }> = {
    mahasiswa: {
      title: "Portal Mahasiswa", sub: "Pinjam buku, cek koleksi, dan pantau riwayat peminjaman Anda.",
      stats: [{ label: "Buku Tersedia", value: "12.840" }, { label: "Anggota Aktif", value: "3.210" }, { label: "Koleksi Islam", value: "840" }, { label: "Koleksi Baru", value: "128" }],
    },
    dosen: {
      title: "Portal Dosen", sub: "Akses referensi penelitian, jurnal ilmiah, dan koleksi akademik UIN Jakarta.",
      stats: [{ label: "Jurnal Tersedia", value: "4.200" }, { label: "Buku Referensi", value: "8.400" }, { label: "Database Online", value: "12" }, { label: "Koleksi Baru", value: "128" }],
    },
    admin: {
      title: "Portal Admin", sub: "Kelola koleksi, anggota, peminjaman, dan laporan perpustakaan UIN Jakarta.",
      stats: [{ label: "Total Buku", value: "12.840" }, { label: "Pinjaman Aktif", value: "847" }, { label: "Total Anggota", value: "3.210" }, { label: "Denda Bulan Ini", value: "Rp1,2Jt" }],
    },
  };
  const sidebar = sidebarInfo[role];

  return (
    <motion.div {...pageMotion} className="min-h-screen flex">
      {/* Panel kiri */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] bg-gradient-to-br from-[#001A4E] via-[#003087] to-[#004DB3] p-10 text-white shrink-0">
        <button onClick={() => navigate("landing")} className="flex items-center gap-3">
          <ImageWithFallback src={uinLogo} alt="Logo UIN Jakarta" className="w-12 h-12 object-contain drop-shadow-md" />
          <div>
            <div className="font-bold text-base leading-tight">Perpustakaan UIN Jakarta</div>
            <div className="text-white/60 text-xs">UIN Syarif Hidayatullah Jakarta</div>
          </div>
        </button>

        <div>
          <div className="text-4xl mb-3">{cfg.icon}</div>
          <h2 className="text-3xl font-bold mb-3 leading-tight">{sidebar.title}</h2>
          <p className="text-white/75 leading-relaxed mb-8 text-sm">{sidebar.sub}</p>
          <div className="grid grid-cols-2 gap-3">
            {sidebar.stats.map(({ label, value }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-xl font-bold">{value}</div>
                <div className="text-white/65 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-white/40 text-xs">© 2026 UIN Syarif Hidayatullah Jakarta</div>
      </div>

      {/* Panel kanan — form */}
      <div className="flex-1 flex items-center justify-center bg-[#F4F7FF] p-6">
        <div className="w-full max-w-[420px]">
          {/* Logo mobile */}
          <button onClick={() => navigate("landing")} className="flex items-center gap-2.5 mb-8 lg:hidden">
            <ImageWithFallback src={uinLogo} alt="Logo UIN Jakarta" className="w-11 h-11 object-contain" />
            <span className="font-bold text-[#003087]">Perpustakaan UIN Jakarta</span>
          </button>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Selamat Datang Kembali</h1>
            <p className="text-muted-foreground text-sm mt-1">Pilih peran dan masuk ke sistem perpustakaan</p>
          </div>

          {/* Tab pemilihan peran */}
          <div className="grid grid-cols-3 gap-2 mb-6 p-1.5 bg-white rounded-2xl border border-border shadow-sm">
            {(["mahasiswa", "dosen", "admin"] as Role[]).map(r => (
              <button key={r} onClick={() => handleRoleChange(r)}
                className={cn("flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-semibold transition-all duration-200",
                  role === r
                    ? "bg-[#003087] text-white shadow-md"
                    : "text-muted-foreground hover:text-[#003087] hover:bg-[#003087]/5"
                )}>
                <span className="text-lg leading-none">{roleConfig[r].icon}</span>
                <span>{roleConfig[r].label}</span>
                <span className={cn("text-[10px] font-normal leading-tight text-center",
                  role === r ? "text-white/70" : "text-muted-foreground"
                )}>{roleConfig[r].desc}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div className="flex flex-col gap-3 mb-4">
            {/* Field ID sesuai peran */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">{cfg.idLabel}</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#003087] bg-[#003087]/10 px-2 py-0.5 rounded-lg select-none">
                  {cfg.idLabel}
                </span>
                <input
                  value={idNumber} onChange={e => setIdNumber(e.target.value)}
                  placeholder={cfg.idPlaceholder}
                  className="w-full pl-[72px] pr-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087] placeholder:text-muted-foreground transition-all"
                />
              </div>
            </div>

            <InputField label="Email" type="email" placeholder={cfg.emailPlaceholder} value={email} onChange={setEmail} icon={Mail} />

            <InputField label="Kata Sandi" type={showPw ? "text" : "password"} placeholder="Masukkan kata sandi" value={password} onChange={setPassword} icon={Lock}
              rightIcon={
                <button onClick={() => setShowPw(!showPw)} className="text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          <div className="flex items-center justify-between mb-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded accent-[#003087]" />
              <span className="text-sm text-muted-foreground">Ingat saya</span>
            </label>
            <button className="text-sm text-[#003087] font-medium hover:underline">Lupa kata sandi?</button>
          </div>

          <Btn onClick={handleLogin} disabled={loading} size="lg" className="w-full">
            {loading
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Sedang masuk...</>
              : <><ArrowRight className="w-4 h-4" /> Masuk sebagai {cfg.label}</>
            }
          </Btn>

          {/* Demo hint */}
          <div className="mt-4 p-3 bg-[#003087]/5 border border-[#003087]/15 rounded-xl text-xs text-[#003087]">
            <strong>Demo:</strong> Isi {cfg.idLabel}, email, dan kata sandi apapun lalu klik Masuk.
            {role === "admin" && <span className="block mt-0.5 text-muted-foreground">Admin akan diarahkan ke dasbor pengelolaan.</span>}
            {role === "dosen" && <span className="block mt-0.5 text-muted-foreground">Catatan: demo ini menggunakan dashboard Mahasiswa.</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────
// PAGE: USER DASHBOARD
// ─────────────────────────────────────────
function DashboardPage({ navigate, onSelectBook }: { navigate: (p: Page) => void; onSelectBook: (b: Book) => void }) {
  const activeLoans = loans.filter(l => l.status === "aktif").length;
  const overdueLoans = loans.filter(l => l.status === "terlambat").length;

  return (
    <div className="min-h-screen bg-[#F4F7FF]">
      <TopNav navigate={navigate} currentPage="dashboard" unreadCount={2} />
      <motion.div {...pageMotion} className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Selamat pagi, Ahmad! 👋</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">Senin, 29 Juni 2026</p>
          </div>
          <Btn onClick={() => navigate("login")}><Search className="w-4 h-4" /> Jelajahi Katalog</Btn>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {[
            { label: "Pinjaman Aktif", value: activeLoans, icon: BookOpen, color: "text-[#003087] bg-[#003087]/10", sub: "buku dipinjam" },
            { label: "Terlambat", value: overdueLoans, icon: AlertTriangle, color: "text-red-600 bg-red-50", sub: "perlu perhatian" },
            { label: "Buku Dikembalikan", value: 2, icon: CheckCircle, color: "text-green-600 bg-green-50", sub: "bulan ini" },
          ].map(({ label, value, icon: Icon, color, sub }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", color)}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className="text-sm font-medium text-foreground">{label}</div>
              <div className="text-xs text-muted-foreground">{sub}</div>
            </div>
          ))}
        </div>

        {overdueLoans > 0 && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">You have {overdueLoans} overdue book(s)</p>
              <p className="text-xs text-red-600">Denda Rp2.000/hari berlaku. Harap segera kembalikan buku.</p>
            </div>
            <Btn onClick={() => navigate("loans")} variant="danger" size="sm">Lihat Pinjaman</Btn>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Pinjaman Aktif</h2>
            <button onClick={() => navigate("login")} className="text-sm text-[#003087] font-medium hover:underline flex items-center gap-1">
              Lihat semua <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {loans.filter(l => l.status !== "dikembalikan").slice(0, 2).map(loan => {
              const dueDate = new Date(loan.dueDate);
              const today = new Date("2026-06-29");
              const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / 86400000);
              return (
                <div key={loan.id} className="bg-white rounded-2xl p-4 border border-border shadow-sm flex items-center gap-3">
                  <img src={loan.bookCover} alt={loan.bookJudul} className="w-14 h-20 object-cover rounded-xl shadow-sm bg-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">{loan.bookJudul}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 mb-2">{loan.bookPenulis}</div>
                    {loan.status === "terlambat"
                      ? <Badge variant="error">Terlambat — Denda Rp{((loan.fine ?? 0) * 1000).toLocaleString("id-ID")}</Badge>
                      : <div className={cn("text-xs font-medium flex items-center gap-1", daysLeft <= 3 ? "text-amber-600" : "text-green-600")}>
                        <Clock className="w-3 h-3" />
                        {daysLeft > 0 ? `${daysLeft} hari tersisa` : "Jatuh tempo hari ini"}
                      </div>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Populer Minggu Ini</h2>
            <button onClick={() => navigate("catalog")} className="text-sm text-[#003087] font-medium hover:underline flex items-center gap-1">
              Lihat katalog <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {books.slice(0, 6).map(book => (
              <button key={book.id} onClick={() => { onSelectBook(book); navigate("book-detail"); }} className="group text-tersisa">
                <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[3/4] shadow-sm group-hover:shadow-lg transition-shadow">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="mt-2">
                  <div className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">{book.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{book.author.split(" ").slice(-1)[0]}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Baru Ditambahkan</h2>
            <Badge variant="success">New</Badge>
          </div>
          <div className="flex flex-col gap-3">
            {books.slice(6, 10).map(book => (
              <button key={book.id} onClick={() => { onSelectBook(book); navigate("book-detail"); }}
                className="bg-white rounded-2xl p-4 border border-border shadow-sm flex items-start gap-4 hover:border-[#003087]/30 hover:shadow-md transition-all text-left w-full group">
                <img src={book.cover} alt={book.title} className="w-14 h-20 object-cover rounded-xl shadow-sm bg-gray-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-foreground line-clamp-1 text-left">{book.title}</div>
                      <div className="text-sm text-muted-foreground text-left">{book.author}</div>
                      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        <Badge variant="default">{book.category}</Badge>
                        <StarPenilaian rating={book.rating} />
                      </div>
                    </div>
                    <div className="shrink-0 self-start"><KetersediaanBadge available={book.available} total={book.total} /></div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-[#003087] transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* Seksi Buku Islami */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#003087] to-[#F5B800] rounded-xl flex items-center justify-center text-xl shadow-md">
                ☪️
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Koleksi Buku Islami</h2>
                <p className="text-xs text-muted-foreground">Literatur Islam pilihan Perpustakaan FST UIN Jakarta</p>
              </div>
            </div>
            <button onClick={() => navigate("catalog")} className="text-sm text-[#003087] font-medium hover:underline flex items-center gap-1">
              Lihat semua <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#001A4E] via-[#003087] to-[#004DB3] p-5 mb-4 text-white">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-20 select-none">☪️</div>
            <p className="text-xs font-semibold text-[#F5B800] uppercase tracking-widest mb-1">Koleksi Unggulan</p>
            <h3 className="text-lg font-bold mb-1">Literatur Islam & Kajian Keislaman</h3>
            <p className="text-white/70 text-xs leading-relaxed max-w-md">Koleksi karya ulama klasik dan kontemporer — tafsir, hadits, fiqih, sirah, dan tasawuf untuk mendukung studi keislaman Anda.</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs bg-white/15 px-2.5 py-1 rounded-full">{islamicBooks.length} judul tersedia</span>
              <span className="text-xs bg-[#F5B800]/20 text-[#F5B800] px-2.5 py-1 rounded-full font-semibold">Baru diperbarui</span>
            </div>
          </div>

          {/* Grid buku islami */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {islamicBooks.slice(0, 4).map(book => (
              <button key={book.id} onClick={() => { onSelectBook(book); navigate("book-detail"); }}
                className="group text-left bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg hover:border-[#003087]/30 transition-all duration-200">
                <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold bg-[#F5B800] text-[#001A4E] px-1.5 py-0.5 rounded-full">Islam</span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs font-semibold text-foreground line-clamp-2 leading-tight mb-1">{book.title}</div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">{book.author}</div>
                  <div className="mt-1.5 flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={cn("w-3 h-3", i <= Math.round(book.rating) ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                    ))}
                  </div>
                  <div className="mt-1.5">
                    <KetersediaanBadge available={book.available} total={book.total} />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Row kedua - list */}
          <div className="flex flex-col gap-2 mt-3">
            {islamicBooks.slice(4, 7).map(book => (
              <button key={book.id} onClick={() => { onSelectBook(book); navigate("book-detail"); }}
                className="group bg-white rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-[#003087]/30 transition-all p-3 flex items-center gap-3 text-left w-full">
                <img src={book.cover} alt={book.title} className="w-12 h-16 object-cover rounded-xl bg-gray-100 shadow-sm shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground line-clamp-1">{book.title}</div>
                  <div className="text-xs text-muted-foreground">{book.author}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-[#F5B800]/15 text-[#003087] font-semibold px-1.5 py-0.5 rounded-full">Buku Islam</span>
                    <KetersediaanBadge available={book.available} total={book.total} />
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-[#003087] transition-colors" />
              </button>
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE: CATALOG
// ─────────────────────────────────────────
function CatalogPage({ navigate, onSelectBook }: { navigate: (p: Page) => void; onSelectBook: (b: Book) => void }) {
  const [search, setSearch] = useState("");
  const [category, setKategori] = useState("Semua");
  const [sortBy, setSortBy] = useState("title");
  const [viewMode, setLihatMode] = useState<"grid" | "list">("grid");
  const [showFilter, setShowFilter] = useState(false);
  const [availableOnly, setTersediaOnly] = useState(false);

  const allBooks = [...books, ...islamicBooks];
  const filtered = allBooks.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !search || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.includes(q);
    const matchCat = category === "Semua" || b.category === category;
    const matchAvail = !availableOnly || b.available > 0;
    return matchSearch && matchCat && matchAvail;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "year") return b.year - a.year;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="min-h-screen bg-[#F4F7FF]">
      <TopNav navigate={navigate} currentPage="catalog" unreadCount={2} />
      <motion.div {...pageMotion} className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Katalog Buku</h1>
            <p className="text-muted-foreground text-sm">{filtered.length} buku ditemukan</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari buku, penulis..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087]" />
            </div>
            <button onClick={() => setShowFilter(!showFilter)}
              className={cn("flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors",
                showFilter ? "border-[#003087] bg-[#003087] text-white" : "border-border bg-white text-muted-foreground hover:text-[#003087] hover:border-[#003087]/50"
              )}>
              <Filter className="w-4 h-4" /> Filter
            </button>
            <div className="flex items-center border border-border rounded-xl overflow-hidden bg-white">
              <button onClick={() => setLihatMode("grid")} className={cn("p-2.5 transition-colors", viewMode === "grid" ? "bg-[#003087] text-white" : "text-muted-foreground hover:text-[#003087]")}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setLihatMode("list")} className={cn("p-2.5 transition-colors", viewMode === "list" ? "bg-[#003087] text-white" : "text-muted-foreground hover:text-[#003087]")}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {showFilter && (
          <div className="bg-white rounded-2xl border border-border p-4 mb-5 flex flex-wrap items-end gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Urutkan</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30">
                <option value="title">Judul A–Z</option>
                <option value="rating">Nilai Tertinggi</option>
                <option value="year">Terbaru</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Kategori</label>
              <select value={category} onChange={e => setKategori(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30">
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input type="checkbox" checked={availableOnly} onChange={e => setTersediaOnly(e.target.checked)} className="w-4 h-4 rounded accent-[#003087]" />
              <span className="text-sm font-medium text-foreground">Tersedia saja</span>
            </label>
          </div>
        )}

        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5">
          {categories.map(c => (
            <button key={c} onClick={() => setKategori(c)}
              className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0",
                category === c ? "bg-[#003087] text-white shadow-sm" : "bg-white text-muted-foreground border border-border hover:border-[#003087]/50 hover:text-[#003087]"
              )}>
              {c}
            </button>
          ))}
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map(book => (
              <button key={book.id} onClick={() => { onSelectBook(book); navigate("book-detail"); }}
                className="group text-tersisa bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg hover:border-[#003087]/30 transition-all duration-200">
                <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {book.available === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold bg-red-500 px-2 py-0.5 rounded-full">Tidak Tersedia</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-xs font-semibold text-foreground line-clamp-2 leading-tight mb-1">{book.title}</div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">{book.author}</div>
                  <div className="mt-1.5"><StarPenilaian rating={book.rating} /></div>
                  <div className="mt-1.5"><KetersediaanBadge available={book.available} total={book.total} /></div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(book => (
              <button key={book.id} onClick={() => { onSelectBook(book); navigate("book-detail"); }}
                className="group bg-white rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-[#003087]/30 transition-all p-4 flex items-center gap-4 text-tersisa w-full">
                <img src={book.cover} alt={book.title} className="w-14 h-20 object-cover rounded-xl bg-gray-100 shadow-sm shrink-0 group-hover:shadow-md transition-shadow" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground">{book.title}</div>
                  <div className="text-sm text-muted-foreground">{book.author} · {book.year}</div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <Badge variant="default">{book.category}</Badge>
                    <StarPenilaian rating={book.rating} />
                    <KetersediaanBadge available={book.available} total={book.total} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{book.description}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-[#003087] transition-colors" />
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No buku ditemukan</p>
            <p className="text-sm text-muted-foreground mt-1">Coba ubah pencarian atau filter Anda</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE: BOOK DETAIL
// ─────────────────────────────────────────
function BookDetailPage({ navigate, book, onBorrow }: { navigate: (p: Page) => void; book: Book; onBorrow: () => void }) {
  const [tab, setTab] = useState<"aktif" | "terlambat" | "dikembalikan">("aktif");
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservationDate, setReservationDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [reservationNote, setReservationNote] = useState("");
  const [reservationSubmitted, setReservationSubmitted] = useState(false);
  const related = books.filter(b => b.category === book.category && b.id !== book.id).slice(0, 4);

  function goToRelated() {
    navigate("book-detail");
  }

  return (
    <div className="min-h-screen bg-[#F4F7FF]">
      <TopNav navigate={navigate} currentPage="catalog" unreadCount={2} />
      <motion.div {...pageMotion} className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-5">
          <button onClick={() => navigate("catalog")} className="hover:text-[#003087] transition-colors">Katalog</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => navigate("catalog")} className="hover:text-[#003087] transition-colors">{book.category}</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium line-clamp-1">{book.title}</span>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="relative w-48 h-64 sm:w-56 sm:h-72">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover rounded-2xl shadow-xl bg-gray-100" />
                  {/* favorite removed */}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  {book.available > 0
                    ? <Btn onClick={onBorrow} size="lg" className="w-full"><BookOpen className="w-4 h-4" /> Pinjam Buku</Btn>
                    : <Btn variant="outline" size="lg" className="w-full" onClick={() => {
                        if (reservationSubmitted) {
                          setShowReservationForm(false);
                          return;
                        }
                        setShowReservationForm(v => !v);
                      }}><Clock className="w-4 h-4" /> {reservationSubmitted ? "Reservasi Diajukan" : "Ajukan Reservasi"}</Btn>
                  }
                  {book.available === 0 && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left">
                      {reservationSubmitted ? (
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">Reservasi berhasil diajukan</p>
                              <p className="text-xs text-muted-foreground">Kami akan memberi tahu Anda saat buku tersedia. Perkiraan pengambilan: {reservationDate}</p>
                            </div>
                          </div>
                        </div>
                      ) : showReservationForm ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            setReservationSubmitted(true);
                            toast.success(`Reservasi untuk “${book.title}” berhasil diajukan.`);
                          }}
                          className="space-y-3"
                        >
                          <div className="flex items-start gap-2">
                            <BookMarked className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">Formulir Reservasi</p>
                              <p className="text-xs text-muted-foreground">Isi detail berikut agar petugas bisa memproses antrian reservasi Anda.</p>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-foreground block mb-1">Tanggal perkiraan ambil</label>
                            <div className="relative">
                              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              <input
                                type="date"
                                value={reservationDate}
                                onChange={(e) => setReservationDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-foreground block mb-1">Catatan (opsional)</label>
                            <textarea
                              value={reservationNote}
                              onChange={(e) => setReservationNote(e.target.value)}
                              rows={3}
                              placeholder="Contoh: Saya butuh buku untuk tugas minggu depan."
                              className="w-full px-3 py-2 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30"
                            />
                          </div>

                          <button type="submit" className="w-full rounded-xl bg-[#003087] px-3 py-2 text-sm font-semibold text-white hover:bg-[#002a6b] transition-colors">
                            Ajukan Reservasi
                          </button>
                        </form>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <BookMarked className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">Reservasi buku</p>
                              <p className="text-xs text-muted-foreground">Isi formulir untuk mengajukan antrian peminjaman saat buku tersedia kembali.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {EBOOK_IDS.has(book.id) ? (
                    <Btn onClick={() => navigate("ebook")} variant="secondary" size="md" className="w-full">
                      <Eye className="w-4 h-4" /> Baca E-Book Online
                    </Btn>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-xl text-xs text-muted-foreground">
                      <Eye className="w-4 h-4 shrink-0" />
                      E-Book tidak tersedia untuk buku ini
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge variant="default">{book.category}</Badge>
                  <Badge variant={book.available > 0 ? "success" : "error"}>
                    {book.available > 0 ? `${book.available}/${book.total} eksemplar tersedia` : "Semua eksemplar sedang dipinjam"}
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{book.title}</h1>
                <p className="text-lg text-muted-foreground font-medium mb-3">by {book.author}</p>
                <StarPenilaian rating={book.rating} />

                <div className="flex gap-2 mt-6 mb-4 border-b border-border">
                  {(["about", "details"] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      className={cn("pb-3 px-1 text-sm font-semibold capitalize transition-colors border-b-2",
                        tab === t ? "border-[#003087] text-[#003087]" : "border-transparent text-muted-foreground hover:text-foreground"
                      )}>
                      {t === "about" ? "Tentang Buku Ini" : "Detail Buku"}
                    </button>
                  ))}
                </div>

                {tab === "about"
                  ? <p className="text-muted-foreground text-sm leading-relaxed">{book.description}</p>
                  : (
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "ISBN", value: book.isbn },
                        { label: "Penerbit", value: book.publisher },
                        { label: "Tahun", value: String(book.year) },
                        { label: "Jumlah Halaman", value: `${(book.pages ?? 0).toLocaleString()} halaman` },
                        { label: "Bahasa", value: book.language },
                        { label: "Edisi", value: book.edition },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-[#F4F7FF] rounded-xl p-3">
                          <div className="text-xs text-muted-foreground font-medium mb-0.5">{label}</div>
                          <div className="text-sm font-semibold text-foreground">{value}</div>
                        </div>
                      ))}
                    </div>
                  )
                }
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Buku Terkait</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {related.map(b => (
                  <button key={b.id} onClick={goToRelated}
                    className="group text-tersisa bg-white rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="overflow-hidden bg-gray-100 aspect-[3/4]">
                      <img src={b.cover} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-semibold text-foreground line-clamp-2">{b.title}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{b.author.split(" ").slice(-1)[0]}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

}

// ─────────────────────────────────────────
// SHARED: PETUGAS DATA
// ─────────────────────────────────────────
const petugasList = [
  { id: "P01", nama: "Drs. Mukhlis Saifuddin, M.Lib", jabatan: "Kepala Perpustakaan", shift: "Pagi (07.00–14.00)" },
  { id: "P02", nama: "Siti Rahayu, A.Md", jabatan: "Pustakawan Muda", shift: "Pagi (07.00–14.00)" },
  { id: "P03", nama: "Ahmad Rizki, S.IP", jabatan: "Pustakawan Pertama", shift: "Siang (14.00–20.00)" },
  { id: "P04", nama: "Nuraini Hasanah, S.Sos", jabatan: "Staf Layanan Sirkulasi", shift: "Siang (14.00–20.00)" },
  { id: "P05", nama: "Budi Santoso, A.Md", jabatan: "Staf Layanan Koleksi", shift: "Pagi (07.00–14.00)" },
];

// ─────────────────────────────────────────
// PAGE: FORM PEMINJAMAN
// ─────────────────────────────────────────
function BorrowFormPage({ navigate, book }: { navigate: (p: Page) => void; book: Book }) {
  const [petugas, setPetugas] = useState("P01");
  const [tujuan, setTujuan] = useState("");
  const [noHp, setNoHp] = useState("");
  const [setuju, setSetuju] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});

  const today = new Date("2026-06-29");
  const due = new Date(today); due.setDate(due.getDate() + 30);
  const fmt = (d: Date) => d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const pilihanPetugas = petugasList.find(p => p.id === petugas)!;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!tujuan.trim()) e.tujuan = "Tujuan peminjaman wajib diisi.";
    if (!noHp.trim()) e.noHp = "Nomor HP aktif wajib diisi.";
    if (!setuju) e.setuju = "Centang persetujuan syarat terlebih dahulu.";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("borrow-success"); }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FF]">
      <TopNav navigate={navigate} currentPage="catalog" unreadCount={2} />
      <motion.div {...pageMotion} className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-5">
          <button onClick={() => navigate("catalog")} className="hover:text-[#003087]">Katalog</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => navigate("book-detail")} className="hover:text-[#003087] truncate max-w-[160px]">{book.title}</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">Form Peminjaman</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-1">Form Peminjaman Buku</h1>
        <p className="text-muted-foreground text-sm mb-6">Lengkapi data berikut. Petugas akan memverifikasi dalam 1×24 jam kerja.</p>

        {/* Info Buku */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-5 mb-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Buku yang Dipinjam</p>
          <div className="flex gap-4">
            <img src={book.cover} alt={book.title} className="w-16 h-[88px] object-cover rounded-xl shadow-sm bg-gray-100 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-foreground line-clamp-2 leading-tight">{book.title}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{book.author}</div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="default">{book.category}</Badge>
                <Badge variant="success">{book.available} eksemplar tersedia</Badge>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-[#F4F7FF] rounded-xl p-3">
              <div className="text-[11px] text-muted-foreground mb-0.5">Tanggal Pinjam</div>
              <div className="text-sm font-semibold text-foreground">{fmt(today)}</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <div className="text-[11px] text-amber-600 mb-0.5">Jatuh Tempo (30 hari)</div>
              <div className="text-sm font-semibold text-amber-800">{fmt(due)}</div>
            </div>
          </div>
        </div>

        {/* Data Peminjam */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-5 mb-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Data Peminjam (Otomatis)</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Nama Lengkap", value: "Ahmad Firdaus" },
              { label: "NIM", value: "11220910000123" },
              { label: "Jurusan", value: "Teknik Informatika" },
              { label: "Semester", value: "Semester 8" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#F4F7FF] rounded-xl p-3">
                <div className="text-[11px] text-muted-foreground mb-0.5">{label}</div>
                <div className="text-sm font-semibold text-foreground">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Petugas Jaga */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-5 mb-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
            Petugas Perpustakaan yang Bertugas <span className="text-red-500">*</span>
          </p>
          <div className="flex flex-col gap-2">
            {petugasList.map(p => (
              <label key={p.id} className={cn(
                "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                petugas === p.id ? "border-[#003087] bg-[#003087]/5" : "border-border hover:border-[#003087]/30"
              )}>
                <input type="radio" name="petugas" value={p.id} checked={petugas === p.id}
                  onChange={() => setPetugas(p.id)} className="accent-[#003087] w-4 h-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">{p.nama}</div>
                  <div className="text-xs text-muted-foreground">{p.jabatan} · {p.shift}</div>
                </div>
                {petugas === p.id && <CheckCircle className="w-4 h-4 text-[#003087] shrink-0" />}
              </label>
            ))}
          </div>
          {pilihanPetugas && (
            <div className="mt-3 p-3 bg-[#003087]/5 border border-[#003087]/20 rounded-xl text-xs text-[#003087]">
              ✓ Petugas dipilih: <strong>{pilihanPetugas.nama}</strong> ({pilihanPetugas.shift})
            </div>
          )}
        </div>

        {/* Detail Peminjaman */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-5 mb-4 flex flex-col gap-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Detail Peminjaman</p>
          <div>
            <label className="text-sm font-semibold text-foreground mb-1.5 block">
              Tujuan Peminjaman <span className="text-red-500">*</span>
            </label>
            <textarea value={tujuan} onChange={e => setTujuan(e.target.value)} rows={3}
              placeholder="cth. Referensi skripsi BAB II, bahan kuliah Algoritma, penelitian tugas akhir..."
              className={cn("w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 resize-none",
                errs.tujuan ? "border-red-400 bg-red-50" : "border-border bg-white focus:border-[#003087]"
              )} />
            {errs.tujuan && <p className="text-xs text-red-500 mt-1">{errs.tujuan}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground mb-1.5 block">
              Nomor HP Aktif <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={noHp} onChange={e => setNoHp(e.target.value)} placeholder="cth. 08123456789"
                className={cn("w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30",
                  errs.noHp ? "border-red-400 bg-red-50" : "border-border focus:border-[#003087]"
                )} />
            </div>
            {errs.noHp && <p className="text-xs text-red-500 mt-1">{errs.noHp}</p>}
          </div>
        </div>

        {/* Syarat */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
          <p className="text-sm font-bold text-amber-800 mb-2">⚠️ Syarat & Ketentuan Peminjaman</p>
          <ul className="text-xs text-amber-700 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>Durasi peminjaman maksimal <strong>30 hari</strong> dari tanggal pinjam.</li>
            <li>Denda keterlambatan <strong>Rp2.000/hari</strong> setelah jatuh tempo.</li>
            <li>Perpanjangan hanya dapat dilakukan <strong>1 kali</strong> melalui aplikasi.</li>
            <li>Buku rusak/hilang wajib diganti sesuai harga buku yang berlaku.</li>
            <li>Anggota yang memiliki tunggakan denda tidak dapat meminjam buku baru.</li>
          </ul>
          <label className="flex items-start gap-2.5 mt-3 cursor-pointer">
            <input type="checkbox" checked={setuju} onChange={e => setSetuju(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded accent-[#003087] shrink-0" />
            <span className="text-xs text-amber-800 font-medium leading-relaxed">
              Saya telah membaca dan menyetujui seluruh syarat dan ketentuan peminjaman buku Perpustakaan UIN Jakarta.
            </span>
          </label>
          {errs.setuju && <p className="text-xs text-red-500 mt-1 ml-6">{errs.setuju}</p>}
        </div>

        <div className="flex gap-3">
          <Btn onClick={() => navigate("book-detail")} variant="outline" size="lg" className="flex-1">
            <ChevronLeft className="w-4 h-4" /> Kembali
          </Btn>
          <Btn onClick={handleSubmit} disabled={loading} size="lg" className="flex-1">
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Memproses...</> : <><Check className="w-4 h-4" /> Ajukan Peminjaman</>}
          </Btn>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE: E-BOOK READER
// ─────────────────────────────────────────
// Buku-buku yang tersedia sebagai E-Book lengkap
const EBOOK_IDS = new Set(["1", "2", "6", "I01", "I04"]);

interface EbookContent { pages: string[]; toc: { title: string; page: number }[] }

const ebookLibrary: Record<string, EbookContent> = {
  "1": {
    toc: [
      { title: "Bab 1 — Peran Algoritma", page: 0 },
      { title: "1.1 Algoritma sebagai Teknologi", page: 1 },
      { title: "Bab 2 — Pengantar Analisis Algoritma", page: 2 },
      { title: "2.1 Notasi Asimptotik", page: 3 },
      { title: "2.2 Analisis Kasus Terburuk", page: 4 },
      { title: "Bab 3 — Sorting & Order Statistics", page: 5 },
      { title: "3.1 Insertion Sort", page: 6 },
      { title: "3.2 Merge Sort", page: 7 },
      { title: "Bab 4 — Struktur Data Dasar", page: 8 },
      { title: "4.1 Stack dan Queue", page: 9 },
    ],
    pages: [
      `BAB 1 — PERAN ALGORITMA DALAM KOMPUTASI\n\nApa itu algoritma? Secara informal, algoritma adalah prosedur komputasi yang terdefinisi dengan baik, yang mengambil nilai atau sekumpulan nilai sebagai masukan (input) dan menghasilkan nilai atau sekumpulan nilai sebagai keluaran (output). Dengan demikian, algoritma adalah urutan langkah komputasi yang mentransformasi masukan menjadi keluaran.\n\nKita juga dapat memandang algoritma sebagai alat untuk memecahkan masalah komputasi yang dispesifikasikan dengan baik. Spesifikasi masalah mendeskripsikan hubungan masukan/keluaran yang diinginkan secara umum. Algoritma mendeskripsikan prosedur komputasi yang spesifik untuk mencapai hubungan masukan/keluaran tersebut.\n\nSebagai contoh, kita mungkin perlu mengurutkan urutan n angka ⟨a₁, a₂, ..., aₙ⟩ menjadi sebuah permutasi ⟨a'₁, a'₂, ..., a'ₙ⟩ sedemikian sehingga a'₁ ≤ a'₂ ≤ ... ≤ a'ₙ. Masukan ini disebut instance dari masalah pengurutan. Secara umum, sebuah instance dari sebuah masalah terdiri dari masukan (yang memenuhi batasan apapun yang dinyatakan dalam spesifikasi masalah) yang dibutuhkan untuk menghitung solusi dari masalah tersebut.`,
      `1.1 ALGORITMA SEBAGAI TEKNOLOGI\n\nMisalkan komputer hanya dapat melakukan komputasi secara instan dan memori komputer gratis. Apakah ada alasan untuk mempelajari algoritma? Jawabannya adalah ya, karena Anda masih ingin tahu bahwa solusi Anda benar, tetapi Anda mungkin juga ingin memiliki metode yang baik untuk mendeskripsikan gagasan Anda.\n\nNamun dalam kenyataannya, komputer tidaklah secepat itu dan memori tidaklah semurah itu. Oleh karena itu, waktu dan ruang komputasi merupakan sumber daya yang terbatas dan perlu digunakan secara bijaksana. Algoritma yang efisien sangat diperlukan.\n\n**Efisiensi.** Algoritma yang berbeda dirancang untuk memecahkan masalah yang sama seringkali berbeda secara dramatis dalam efisiensinya. Perbedaan ini bisa jauh lebih signifikan daripada perbedaan yang disebabkan oleh perangkat keras dan perangkat lunak.\n\nSebagai contoh, bab ini memperkenalkan dua algoritma untuk mengurutkan. Yang pertama, yang dikenal sebagai insertion sort, membutuhkan waktu kira-kira c₁n² untuk mengurutkan n item, dimana c₁ adalah konstanta yang tidak bergantung pada n. Yang kedua, yang dikenal sebagai merge sort, membutuhkan waktu kira-kira c₂n lg n, dimana lg n berarti log₂n dan c₂ adalah konstanta lain yang tidak bergantung pada n.`,
      `BAB 2 — PENGANTAR ANALISIS ALGORITMA\n\nSetelah melihat pengantar algoritma melalui contoh insertion sort, kita akan melihat alat analisis yang lebih formal dalam bab ini. Kita akan mulai dengan memeriksa metode insertion sort secara lebih teliti.\n\n**Model Komputasi.** Kami umumnya mengasumsikan model komputasi generik dengan satu prosesor, model komputasi akses acak (random-access machine / RAM), di mana instruksi dieksekusi satu demi satu tanpa operasi konkuren.\n\nModel RAM berisi instruksi yang biasa ditemukan dalam komputer nyata: aritmetika (seperti penjumlahan, pengurangan, perkalian, pembagian, sisa hasil bagi, lantai, ceiling), pemindahan data (load, store, copy), dan kontrol (conditional and unconditional branch, subroutine call and return).\n\nSetiap instruksi tersebut memerlukan waktu yang konstan. Model RAM mengikuti tipe data yang ditemukan dalam komputer nyata — bilangan bulat dan bilangan titik mengambang (floating point).\n\nKita tidak mengizinkan instruksi yang membutuhkan waktu eksekusi yang tidak terbatas, seperti operasi dengan ukuran data sewenang-wenang atau komputasi eksponen. Bahkan, kami menggunakan ukuran kata yang terbatas.`,
      `2.1 NOTASI ASIMPTOTIK\n\nNotasi asimptotik adalah bahasa yang digunakan untuk mendeskripsikan running time sebuah algoritma. Dasar dari analisis asimptotik adalah memeriksa perilaku fungsi untuk nilai masukan yang sangat besar.\n\n**Notasi Θ (Theta).** Untuk fungsi g(n) yang diberikan, kita menuliskan Θ(g(n)) untuk menyatakan himpunan fungsi:\n\nΘ(g(n)) = { f(n) : terdapat konstanta positif c₁, c₂, dan n₀ sedemikian sehingga 0 ≤ c₁g(n) ≤ f(n) ≤ c₂g(n) untuk semua n ≥ n₀ }\n\nSebuah fungsi f(n) termasuk dalam himpunan Θ(g(n)) jika terdapat konstanta positif c₁ dan c₂ sedemikian sehingga fungsi tersebut dapat "dijepit" antara c₁g(n) dan c₂g(n), untuk nilai n yang cukup besar.\n\n**Notasi O (Big-Oh).** Notasi Θ secara asimptotik membatasi fungsi dari atas dan bawah. Ketika kita hanya memiliki batas asimptotik atas, kita menggunakan notasi O. Untuk fungsi g(n) yang diberikan, kita menuliskan O(g(n)) (dibaca "big-oh dari g dari n" atau "O dari g dari n") untuk menyatakan himpunan fungsi:\n\nO(g(n)) = { f(n) : terdapat konstanta positif c dan n₀ sedemikian sehingga 0 ≤ f(n) ≤ cg(n) untuk semua n ≥ n₀ }`,
      `2.2 ANALISIS KASUS TERBURUK, KASUS RATA-RATA, DAN KASUS TERBAIK\n\nDalam menganalisis insertion sort, kami melihat running time terbaik dan terburuk. Umumnya, seperti yang kita lakukan untuk insertion sort, kita hanya memperhatikan running time kasus terburuk — waktu running terpanjang untuk masukan berukuran n. Ada tiga alasan untuk orientasi ini:\n\n1. Running time kasus terburuk dari sebuah algoritma memberikan batas atas running time untuk setiap masukan. Mengetahui hal ini memberi kita jaminan bahwa algoritma tidak akan pernah membutuhkan waktu lebih lama. Kita tidak perlu membuat asumsi tentang running time dan berharap bahwa itu tidak akan pernah jauh lebih buruk.\n\n2. Untuk beberapa algoritma, kasus terburuk terjadi cukup sering. Misalnya, ketika mencari informasi dalam database, kasus terburuk algoritma pencarian sering terjadi ketika informasi tidak ada dalam database. Dalam beberapa aplikasi, pencarian untuk data yang tidak ada mungkin merupakan operasi umum.\n\n3. "Kasus rata-rata" seringkali kira-kira seburuk kasus terburuk. Misalkan kita secara acak memilih n angka dan menerapkan insertion sort. Berapa lama waktu rata-rata yang dibutuhkan untuk menentukan di mana dalam subarray A[1..j-1] untuk menyisipkan elemen A[j]?`,
      `BAB 3 — SORTING DAN ORDER STATISTICS\n\nBab ini memperkenalkan beberapa algoritma yang memecahkan masalah pengurutan berikut:\n\n**Masukan:** Sebuah urutan n angka ⟨a₁, a₂, ..., aₙ⟩.\n**Keluaran:** Sebuah permutasi (penataan ulang) ⟨a'₁, a'₂, ..., a'ₙ⟩ dari urutan masukan sedemikian sehingga a'₁ ≤ a'₂ ≤ ... ≤ a'ₙ.\n\nUrutan masukan biasanya merupakan array, meskipun bisa juga direpresentasikan dalam bentuk lain, seperti linked list.\n\nStruktur data yang akan diurutkan sering merupakan array catatan (records). Setiap catatan berisi sebuah kunci (key), yang merupakan nilai yang akan diurutkan. Sisa catatan terdiri dari data satelit yang biasanya dibawa bersama kunci. Dalam praktiknya, ketika sebuah program pengurutan menata ulang catatan, ia juga harus menata ulang data satelit.\n\nJika setiap catatan menyertakan banyak data satelit, kita sering kali menata ulang array pointer ke catatan daripada catatan itu sendiri untuk meminimalkan pergerakan data. Buku ini fokus pada masalah pengurutan yang mengurutkan angka — dengan asumsi bahwa kunci dan catatan adalah entitas yang sama.`,
      `3.1 INSERTION SORT\n\nInsertion sort adalah algoritma efisien untuk mengurutkan sejumlah kecil elemen. Insertion sort bekerja dengan cara yang sama seperti banyak orang mengurutkan satu tangan penuh kartu remi. Kita mulai dengan tangan kiri kosong dan kartu menghadap ke bawah di atas meja. Kemudian kita mengambil satu kartu dari meja sekaligus dan memasukkannya ke posisi yang tepat di tangan kiri. Untuk menemukan posisi yang tepat untuk sebuah kartu, kita membandingkannya dengan setiap kartu yang sudah ada di tangan, dari kanan ke kiri.\n\nPseudocode Insertion Sort:\n\nINSERTION-SORT(A, n)\n1  for i = 2 to n\n2      key = A[i]\n3      // Masukkan A[i] ke urutan terurut A[1:i-1]\n4      j = i - 1\n5      while j > 0 and A[j] > key\n6          A[j + 1] = A[j]\n7          j = j - 1\n8      A[j + 1] = key\n\n**Analisis Running Time:**\nRunning time insertion sort bergantung pada ukuran masukan. Umumnya, waktu yang dibutuhkan sebuah algoritma tumbuh seiring dengan ukuran masukan, sehingga adalah praktik standar untuk mendeskripsikan running time sebuah program sebagai fungsi dari ukuran masukan-nya.`,
      `3.2 MERGE SORT\n\nMerge sort mengikuti paradigma divide-and-conquer (bagi dan taklukkan). Secara intuitif, operasi pada urutan n-elemen bekerja sebagai berikut:\n\n**Divide:** Bagi urutan n-elemen yang akan diurutkan menjadi dua subsequence masing-masing n/2-elemen.\n\n**Conquer:** Urutkan dua subsequence secara rekursif menggunakan merge sort.\n\n**Combine:** Gabungkan dua subsequence yang telah diurutkan untuk menghasilkan jawabannya.\n\nRekursi "mencapai dasar" ketika urutan yang akan diurutkan memiliki panjang 1, dalam hal ini tidak ada pekerjaan yang perlu dilakukan, karena setiap urutan dengan panjang 1 sudah terurut.\n\nPseudocode Merge Sort:\n\nMERGE-SORT(A, p, r)\n1  if p ≥ r         // zero or one element?\n2      return\n3  q = ⌊(p + r)/2⌋  // midpoint of A[p:r]\n4  MERGE-SORT(A, p, q)   // recursively sort A[p:q]\n5  MERGE-SORT(A, q+1, r) // recursively sort A[q+1:r]\n6  // Merge A[p:q] and A[q+1:r] into A[p:r]\n7  MERGE(A, p, q, r)\n\nRunning time merge sort adalah Θ(n lg n), yang secara asimptotik lebih baik dari insertion sort Θ(n²) untuk masukan berukuran besar.`,
      `BAB 4 — STRUKTUR DATA DASAR\n\nHimpunan adalah konsep matematika yang fundamental. Tidak hanya dalam matematika, tetapi juga dalam Teknik Informatika, himpunan menjadi dasar hampir semua algoritma. Berbeda dengan matematika, himpunan dalam Teknik Informatika dapat tumbuh, menyusut, atau berubah seiring waktu.\n\nKita menyebut himpunan semacam itu sebagai himpunan dinamis (dynamic sets). Algoritma mungkin memerlukan beberapa jenis operasi yang dilakukan pada himpunan. Misalnya, banyak algoritma hanya perlu menyisipkan elemen ke dalam himpunan, menghapus elemen dari himpunan, dan menguji apakah suatu elemen termasuk dalam himpunan.\n\n**Jenis Operasi Himpunan Dinamis:**\n\nOperasi pencarian (Queries) — mengembalikan informasi tentang himpunan:\n• SEARCH(S, k): Permintaan yang, diberikan sebuah himpunan S dan nilai kunci k, mengembalikan pointer ke elemen dalam S dengan nilai kunci k, atau NIL jika tidak ada elemen tersebut.\n• MINIMUM(S): Permintaan pada himpunan S yang terurut total yang mengembalikan pointer ke elemen S dengan nilai kunci terkecil.\n• MAXIMUM(S): Permintaan pada himpunan S yang terurut total yang mengembalikan pointer ke elemen S dengan nilai kunci terbesar.\n• SUCCESSOR(S, x): Permintaan yang, diberikan elemen x yang nilainya tidak harus merupakan nilai kunci maksimum, mengembalikan pointer ke elemen berikutnya lebih besar dalam S.`,
      `4.1 STACK DAN QUEUE\n\nStack dan queue adalah struktur data dinamis di mana elemen yang dihapus dari himpunan adalah yang ditetapkan sebelumnya.\n\n**Stack** mengimplementasikan kebijakan last-in, first-out (LIFO): elemen yang dihapus dari stack adalah yang paling baru disisipkan. Stack mengimplementasikan dua operasi utama:\n\n• PUSH: Menyisipkan elemen ke atas stack\n• POP: Menghapus dan mengembalikan elemen paling atas\n\nContoh implementasi stack menggunakan array:\n\nSTACK-EMPTY(S)\n1  if S.top == 0\n2      return TRUE\n3  else return FALSE\n\nPUSH(S, x)\n1  if S.top == S.size\n2      error "overflow"\n3  else S.top = S.top + 1\n4       S[S.top] = x\n\n**Queue** mengimplementasikan kebijakan first-in, first-out (FIFO): elemen yang dihapus selalu merupakan yang telah berada dalam himpunan selama paling lama, sehingga queue menghapus elemen secara first-in, first-out basis. Queue memiliki kepala (head) dan ekor (tail). Ketika elemen disisipkan ke queue, ia menempati posisi di tail. Elemen yang dihapus selalu adalah yang berada di head.`,
    ],
  },
  "I01": {
    toc: [
      { title: "Mukadimah Penulis", page: 0 },
      { title: "Bab 1 — Ikhlas dan Niat", page: 1 },
      { title: "1.1 Keutamaan Ikhlas", page: 2 },
      { title: "Bab 2 — Bertaubat", page: 3 },
      { title: "2.1 Syarat-syarat Taubat", page: 4 },
      { title: "Bab 3 — Sabar dan Syukur", page: 5 },
      { title: "3.1 Keutamaan Sabar", page: 6 },
      { title: "Bab 4 — Kejujuran", page: 7 },
      { title: "4.1 Hadits-hadits Kejujuran", page: 8 },
      { title: "Bab 5 — Menjaga Lisan", page: 9 },
    ],
    pages: [
      `MUKADIMAH\n\nSegala puji bagi Allah, Rabb semesta alam. Shalawat dan salam semoga tercurahkan kepada Nabi kita Muhammad ﷺ, keluarganya, dan seluruh sahabatnya.\n\nKitab Riyadhus Shalihin (Taman Orang-orang Shalih) merupakan karya monumental Imam Muhyiddin Abu Zakaria Yahya bin Syaraf An-Nawawi rahimahullah. Imam An-Nawawi adalah salah satu ulama terbesar dalam sejarah Islam yang hidup pada abad ke-13 Masehi.\n\nKitab ini mengumpulkan hadits-hadits shahih dari berbagai sumber yang terpercaya — terutama Shahih Bukhari dan Shahih Muslim, disertai hadits dari kitab-kitab hadits lainnya seperti Sunan Abu Dawud, Jami' At-Tirmidzi, Sunan An-Nasa'i, dan Sunan Ibnu Majah.\n\nTujuan penulisan kitab ini adalah untuk mendekatkan diri kepada Allah Ta'ala dengan cara mempelajari dan mengamalkan hadits-hadits Nabi ﷺ yang mulia. Setiap bab diawali dengan ayat-ayat Al-Quran yang relevan, kemudian diikuti hadits-hadits yang berkaitan dengan tema tersebut.\n\nSemoga Allah menjadikan kitab ini bermanfaat bagi kaum muslimin dan menjadi amal jariyah bagi penulisnya. Aamiin.`,
      `BAB 1 — IKHLAS DAN NIAT\n\nAllah Ta'ala berfirman:\n"Dan tidaklah mereka diperintahkan kecuali untuk menyembah Allah dengan ikhlas (memurnikan) ketaatan kepada-Nya dalam menjalankan agama yang lurus." (QS. Al-Bayyinah: 5)\n\nDan Allah Ta'ala berfirman:\n"Daging-daging unta dan darahnya itu sekali-kali tidak dapat mencapai (keridhaan) Allah, tetapi ketakwaan dari kamulah yang dapat mencapainya." (QS. Al-Hajj: 37)\n\nHadits 1:\nDari Amirul Mukminin Abu Hafs Umar bin Al-Khaththab radhiyallahu 'anhu, ia berkata: Aku mendengar Rasulullah ﷺ bersabda:\n\n"Sesungguhnya setiap amalan itu hanyalah tergantung pada niatnya. Dan setiap orang hanya akan mendapatkan apa yang ia niatkan. Barangsiapa yang hijrahnya karena Allah dan Rasul-Nya, maka hijrahnya adalah kepada Allah dan Rasul-Nya. Barangsiapa yang hijrahnya karena dunia yang ingin diraihnya atau karena wanita yang ingin dinikahinya, maka hijrahnya adalah kepada apa yang ia tuju." (Muttafaq 'alaih)`,
      `1.1 KEUTAMAAN IKHLAS\n\nHadits 2:\nDari Aisyah radhiyallahu 'anha, ia berkata:\n"Rasulullah ﷺ bersabda: 'Wahai manusia, sesungguhnya amalan hanyalah dengan ikhlas, dan sesungguhnya kalian hanya akan dibalas sesuai niat kalian.'" (HR. Abu Ya'la)\n\nFaedah-faedah yang terkandung dalam hadits tentang niat:\n\n1. Niat merupakan syarat diterimanya amal ibadah. Tanpa niat yang benar, sebuah amalan tidak akan diterima oleh Allah Ta'ala.\n\n2. Niat membedakan antara ibadah dan kebiasaan. Misalnya, mandi bisa menjadi ibadah jika diniatkan sebagai mandi junub, atau hanya sekedar membersihkan badan.\n\n3. Niat membedakan antara satu ibadah dengan ibadah lainnya. Misalnya, shalat Dzuhur berbeda dengan shalat Ashar, keduanya dibedakan oleh niat.\n\n4. Ikhlas berarti memurnikan niat hanya untuk Allah semata, tidak bercampur dengan tujuan duniawi seperti riya' (pamer) atau sum'ah (mencari pujian).\n\nImam An-Nawawi rahimahullah berkata: "Ketahuilah bahwa ikhlas adalah pondasi dari setiap amal. Barangsiapa yang beramal karena Allah semata, maka amalannya akan naik ke langit dan diterima oleh Allah."`,
      `BAB 2 — BERTAUBAT\n\nAllah Ta'ala berfirman:\n"Sesungguhnya Allah menyukai orang-orang yang bertaubat dan menyukai orang-orang yang mensucikan diri." (QS. Al-Baqarah: 222)\n\nDan Allah Ta'ala berfirman:\n"Hai orang-orang yang beriman, bertaubatlah kepada Allah dengan taubatan nasuhaa (taubat yang semurni-murninya)." (QS. At-Tahrim: 8)\n\nHadits 14:\nDari Abu Hurairah radhiyallahu 'anhu, ia berkata: Rasulullah ﷺ bersabda:\n\n"Demi Allah, sungguh aku memohon ampun kepada Allah dan bertaubat kepada-Nya dalam sehari lebih dari tujuh puluh kali." (HR. Bukhari)\n\nHadits 15:\nDari Al-Agharr Al-Muzani radhiyallahu 'anhu, sesungguhnya Rasulullah ﷺ bersabda:\n\n"Sesungguhnya kadang hatiku tertutup, dan sungguh aku memohon ampun kepada Allah seratus kali dalam sehari." (HR. Muslim)\n\nPelajaran penting: Taubat adalah pintu rahmat Allah yang selalu terbuka selama matahari belum terbit dari barat. Seorang hamba yang bersungguh-sungguh dalam bertaubat akan mendapatkan ampunan dari Allah Yang Maha Pengampun lagi Maha Penyayang.`,
      `2.1 SYARAT-SYARAT TAUBAT\n\nPara ulama menyebutkan bahwa taubat yang benar (taubatan nasuha) harus memenuhi tiga syarat utama:\n\n**Syarat Pertama: Menyesali perbuatan dosa yang telah dilakukan.**\nPenyesalan adalah inti dari taubat. Seseorang yang tidak menyesali perbuatan dosanya, maka taubatnya tidak sah. Penyesalan ini harus tulus dari dalam hati, bukan sekadar ungkapan lisan semata.\n\n**Syarat Kedua: Meninggalkan perbuatan dosa tersebut segera.**\nSeorang yang bertaubat wajib meninggalkan perbuatan dosa yang ia lakukan pada saat itu juga. Ia tidak boleh menunda-nunda untuk meninggalkan dosa tersebut. Jika ia masih melanjutkan perbuatan dosanya, maka taubatnya tidak sah.\n\n**Syarat Ketiga: Bertekad untuk tidak mengulangi dosa tersebut di masa yang akan datang.**\nTekad yang kuat untuk tidak mengulangi perbuatan dosa merupakan syarat yang sangat penting. Namun jika kemudian ia terjerumus kembali ke dalam dosa tersebut, maka ia harus segera bertaubat kembali. Taubat yang pertama tidak batal karena ia terjerumus kembali.\n\n**Syarat Keempat (untuk dosa antar manusia): Mengembalikan hak yang dizalimi atau meminta maaf.**\nJika dosa tersebut berkaitan dengan hak orang lain, maka ia wajib mengembalikan hak tersebut atau meminta maaf kepada orang yang bersangkutan. Ini disebut taubat dari muamalah.`,
      `BAB 3 — SABAR DAN SYUKUR\n\nAllah Ta'ala berfirman:\n"Hai orang-orang yang beriman, bersabarlah kamu dan kuatkanlah kesabaranmu dan tetaplah bersiap siaga dan bertakwalah kepada Allah, supaya kamu beruntung." (QS. Ali Imran: 200)\n\nDan Allah Ta'ala berfirman:\n"Sesungguhnya hanya orang-orang yang bersabarlah yang dicukupkan pahala mereka tanpa batas." (QS. Az-Zumar: 10)\n\nHadits 20:\nDari Abu Yahya Shuhaib bin Sinan radhiyallahu 'anhu, ia berkata: Rasulullah ﷺ bersabda:\n\n"Alangkah mengagumkan urusan orang yang beriman, karena segala urusannya adalah baik, dan hal ini tidak dimiliki oleh siapa pun kecuali orang yang beriman. Apabila ia mendapat kesenangan, ia bersyukur, maka yang demikian itu merupakan kebaikan baginya. Dan apabila ia ditimpa musibah, ia bersabar, maka yang demikian itu merupakan kebaikan baginya." (HR. Muslim)\n\nHadits 21:\nDari Anas bin Malik radhiyallahu 'anhu, ia berkata: Aku mendengar Rasulullah ﷺ bersabda:\n\n"Sesungguhnya Allah berfirman: 'Apabila Aku menguji hamba-Ku dengan dua perkara yang ia cintai kemudian ia bersabar, niscaya Aku akan menggantikan keduanya dengan surga.'" (HR. Bukhari)`,
      `3.1 KEUTAMAAN SABAR\n\nImam An-Nawawi rahimahullah berkata bahwa sabar terbagi menjadi tiga jenis:\n\n**Pertama: Sabar dalam menjalankan ketaatan kepada Allah.**\nYaitu sabar dalam melaksanakan perintah-perintah Allah dan menjauhi larangan-larangan-Nya. Ini adalah jenis sabar yang paling tinggi derajatnya dan paling berat pelaksanaannya, karena nafsu manusia cenderung malas dalam beribadah dan cenderung mengikuti hawa nafsu.\n\n**Kedua: Sabar dalam menjauhi maksiat kepada Allah.**\nYaitu menahan diri dari melakukan perbuatan yang diharamkan Allah, meskipun nafsu sangat menginginkannya. Ini membutuhkan kekuatan iman dan tekad yang kuat.\n\n**Ketiga: Sabar dalam menghadapi takdir Allah yang menyakitkan.**\nYaitu sabar ketika ditimpa musibah, bencana, sakit, kehilangan orang yang dicintai, atau berbagai kesulitan hidup. Seseorang yang sabar dalam menghadapi musibah akan mendapatkan pahala yang besar dari Allah.\n\nRasulullah ﷺ bersabda: "Tidaklah menimpa seorang mukmin berupa rasa sakit, kelelahan, penyakit, kesedihan, bahkan duri yang menusuknya, kecuali Allah akan menghapus dosa-dosanya dengan hal tersebut." (HR. Bukhari dan Muslim)`,
      `BAB 4 — KEJUJURAN\n\nAllah Ta'ala berfirman:\n"Hai orang-orang yang beriman, bertakwalah kamu kepada Allah, dan hendaklah kamu bersama orang-orang yang benar (jujur)." (QS. At-Taubah: 119)\n\nDan Allah Ta'ala berfirman:\n"Ini adalah hari yang bermanfaat bagi orang-orang yang benar kebenaran mereka. Bagi mereka surga yang di bawahnya mengalir sungai-sungai; mereka kekal di dalamnya selama-lamanya." (QS. Al-Maidah: 119)\n\nHadits 54:\nDari Ibnu Mas'ud radhiyallahu 'anhu, dari Nabi ﷺ, beliau bersabda:\n\n"Hendaklah kalian berlaku jujur, karena kejujuran membawa kepada kebaikan, dan kebaikan membawa ke surga. Seseorang senantiasa berlaku jujur dan berusaha untuk jujur sehingga ia dicatat di sisi Allah sebagai orang yang jujur. Dan jauhilah kedustaan, karena kedustaan membawa kepada keburukan, dan keburukan membawa ke neraka. Seseorang senantiasa berdusta dan berusaha untuk berdusta sehingga ia dicatat di sisi Allah sebagai pendusta." (HR. Bukhari dan Muslim)\n\nHadits ini menunjukkan bahwa kejujuran adalah jalan menuju surga, sedangkan kebohongan adalah jalan menuju neraka. Kejujuran bukan hanya dalam perkataan, tetapi juga dalam perbuatan, janji, dan niat.`,
      `4.1 HADITS-HADITS TENTANG KEJUJURAN\n\nHadits 55:\nDari Abu Muhammad Al-Hasan bin Ali bin Abu Thalib radhiyallahu 'anhuma, cucu Rasulullah ﷺ dan kesayangannya, ia berkata: Aku menghafal dari Rasulullah ﷺ (sabdanya):\n\n"Tinggalkanlah apa yang meragukanmu kepada apa yang tidak meragukanmu. Sesungguhnya kejujuran adalah ketenangan dan kebohongan adalah keraguan." (HR. Tirmidzi dan Nasa'i)\n\nHadits 56:\nDari Abu Sufyan Shakhr bin Harb radhiyallahu 'anhu dalam hadits yang panjang tentang Heraklius. Heraklius bertanya kepadanya: "Apa yang ia (Nabi Muhammad) perintahkan kepada kalian?" Abu Sufyan menjawab: "Ia berkata: 'Sembahlah Allah saja dan janganlah kalian menyekutukan-Nya dengan sesuatu pun, dan tinggalkanlah apa yang dikatakan nenek moyang kalian.' Ia juga memerintahkan kami untuk shalat, jujur, menjaga kehormatan diri, dan menyambung silaturahmi." (HR. Bukhari dan Muslim)\n\nKejujuran adalah sifat mulia yang membuat seseorang dicintai oleh Allah dan juga oleh manusia. Orang yang jujur akan mendapatkan kepercayaan dari orang-orang di sekitarnya, sehingga hidupnya akan penuh berkah dan kebaikan.`,
      `BAB 5 — MENJAGA LISAN\n\nAllah Ta'ala berfirman:\n"Tiada suatu ucapanpun yang diucapkannya melainkan ada di dekatnya malaikat pengawas yang selalu hadir." (QS. Qaaf: 18)\n\nHadits 61:\nDari Abu Hurairah radhiyallahu 'anhu, dari Nabi ﷺ, beliau bersabda:\n\n"Barangsiapa beriman kepada Allah dan hari akhir, hendaklah ia berkata yang baik atau diam." (HR. Bukhari dan Muslim)\n\nHadits 62:\nDari Abu Hurairah radhiyallahu 'anhu bahwasannya Rasulullah ﷺ bersabda:\n\n"Sesungguhnya seorang hamba mengucapkan satu kalimat yang membuat Allah ridha, namun ia tidak mengira (hal itu) mengangkat derajatnya; dan sesungguhnya seorang hamba mengucapkan satu kalimat yang membuat Allah murka, namun ia tidak mengira (hal itu) menjatuhkannya ke neraka Jahannam." (HR. Bukhari)\n\nHadits 63:\nDari Abu Hurairah radhiyallahu 'anhu, ia berkata: Aku mendengar Rasulullah ﷺ bersabda:\n\n"Sesungguhnya seorang hamba benar-benar berbicara dengan suatu kalimat yang tidak ia pikirkan, lalu dengan kalimat itu ia terjatuh ke neraka lebih jauh dari jarak antara timur dan barat." (HR. Bukhari dan Muslim)\n\nMenjaga lisan adalah salah satu kunci keselamatan seorang Muslim. Rasulullah ﷺ bersabda: "Barangsiapa yang bisa memberikan jaminan kepadaku tentang apa yang ada di antara dua janggutnya (lisan) dan apa yang ada di antara dua pahanya (kemaluan), niscaya aku memberikan jaminan surga untuknya." (HR. Bukhari)`,
    ],
  },
  "I04": {
    toc: [
      { title: "Pendahuluan", page: 0 },
      { title: "Bab 1 — Masa Sebelum Kenabian", page: 1 },
      { title: "1.1 Nasab Rasulullah ﷺ", page: 2 },
      { title: "1.2 Kelahiran & Masa Kecil", page: 3 },
      { title: "Bab 2 — Awal Kenabian", page: 4 },
      { title: "2.1 Wahyu Pertama", page: 5 },
      { title: "2.2 Dakwah Rahasia", page: 6 },
      { title: "Bab 3 — Hijrah ke Madinah", page: 7 },
      { title: "3.1 Persiapan Hijrah", page: 8 },
      { title: "3.2 Tiba di Madinah", page: 9 },
    ],
    pages: [
      `PENDAHULUAN — AR-RAHIQ AL-MAKHTUM\n\nBismillahirrahmanirrahim.\n\nSegala puji bagi Allah, Rabb semesta alam. Shalawat dan salam semoga tercurahkan kepada pemimpin para rasul, Nabi kita Muhammad ﷺ, kepada keluarganya, dan kepada para sahabatnya semuanya.\n\nKitab "Ar-Rahiq Al-Makhtum" (Segel Minuman Surga) ini adalah biografi Nabi Muhammad ﷺ yang memenangkan Hadiah Pertama dalam kompetisi penulisan sirah yang diselenggarakan oleh Rabithah Al-'Alam Al-Islami. Ditulis oleh Syaikh Shafiyyurrahman Al-Mubarakfuri rahimahullah.\n\nPenulis mendeskripsikan buku ini sebagai upaya untuk menyajikan sirah Nabawiyah (biografi kenabian) dengan cara yang sistematis, ilmiah, dan mudah dipahami oleh pembaca modern. Setiap fakta sejarah disandarkan kepada sumber yang dapat dipercaya.\n\nSemoga Allah memberkahi usaha ini dan menjadikannya sebagai amal yang bermanfaat bagi kaum muslimin. Sesungguhnya, mempelajari kehidupan Rasulullah ﷺ adalah ibadah, karena ia mengandung petunjuk dan cahaya yang dapat menerangi jalan kehidupan kita.`,
      `BAB 1 — MASA SEBELUM KENABIAN\n\nJazirah Arab dan Kondisinya\n\nJazirah Arab adalah daratan besar yang dikelilingi oleh laut dan padang pasir. Batas-batasnya: di sebelah selatan berbatasan dengan Samudera Hindia (Laut Arab dan Teluk Aden), di sebelah barat berbatasan dengan Laut Merah, di sebelah utara dibatasi oleh Syam dan padang pasir Irak, sedangkan di sebelah timur berbatasan dengan Teluk Persia.\n\nSecara geografis, Jazirah Arab terbagi menjadi beberapa wilayah:\n\n1. **Tihamah** — dataran rendah di sepanjang tepi Laut Merah.\n2. **Hijaz** — wilayah yang memisahkan Tihamah dengan Nejd, meliputi kota-kota suci Makkah dan Madinah.\n3. **Nejd** — dataran tinggi di bagian tengah semenanjung.\n4. **'Arudh** — wilayah yang meliputi Al-Bahrain dan Oman.\n5. **Yaman** — terletak di bagian selatan dan barat daya.\n6. **Hadhramaut** — wilayah di bagian tenggara.\n\nPenduduk Jazirah Arab terbagi menjadi dua kelompok utama: penduduk kota (hadhir) yang menetap di kota-kota dan oase, serta penduduk badui (badu) yang hidup berpindah-pindah mengikuti sumber air dan padang rumput.`,
      `1.1 NASAB RASULULLAH ﷺ\n\nMuhammad ﷺ bin Abdullah bin Abdul Muththalib (namanya Syaibah atau Hasyim) bin Hasyim (namanya 'Amr) bin Abdu Manaf (namanya Al-Mughirah) bin Qushay (namanya Zaid) bin Kilab bin Murrah bin Ka'ab bin Lu'ay bin Ghalib bin Fihr bin Malik bin An-Nadhr bin Kinanah bin Khuzaimah bin Mudrikah bin Ilyas bin Mudhar bin Nizar bin Ma'ad bin 'Adnan.\n\nNasab ini telah disepakati kebenarannya oleh para ahli sejarah. Adapun di atas 'Adnan, terdapat perbedaan pendapat di antara para ulama tentang kesahihannya.\n\nAdapun nasab dari pihak ibu: Muhammad ﷺ bin Aminah binti Wahb bin Abdu Manaf bin Zuhrah bin Kilab. Dengan demikian, nasab Rasulullah ﷺ dari pihak ayah dan ibu bertemu pada Kilab.\n\nNasab yang mulia ini menunjukkan bahwa Allah Ta'ala telah memilih Nabi Muhammad ﷺ dari keturunan terbaik Arab dan terbaik manusia. Sebagaimana diriwayatkan bahwa beliau ﷺ bersabda: "Sesungguhnya Allah telah memilih Kinanah dari keturunan Ismail, dan Ia memilih Quraisy dari Kinanah, dan Ia memilih Bani Hasyim dari Quraisy, dan Ia memilihku dari Bani Hasyim." (HR. Muslim)`,
      `1.2 KELAHIRAN DAN MASA KECIL\n\nRasulullah ﷺ lahir di Makkah Al-Mukarramah pada hari Senin, 12 Rabi'ul Awwal, tahun Gajah — yang bertepatan dengan tanggal 22 April 571 M menurut perhitungan yang paling masyhur.\n\nAyah beliau, Abdullah bin Abdul Muththalib, telah wafat sebelum beliau lahir — tepatnya saat beliau masih dalam kandungan ibunya, atau menurut pendapat lain saat beliau baru berusia beberapa bulan.\n\n**Penyusuan:**\nSesuai dengan tradisi bangsa Arab, bayi Muhammad ﷺ diserahkan kepada ibu susuan dari kabilah Bani Sa'd. Beliaulah yang menyusui Rasulullah ﷺ, yaitu Halimah As-Sa'diyyah binti Abu Dzu'aib.\n\nSelama bersama keluarga Halimah, rumah tangga mereka diliputi keberkahan yang luar biasa. Ternak mereka menjadi gemuk dan banyak menghasilkan susu, padahal sebelumnya dalam kondisi yang memprihatinkan. Ini merupakan tanda-tanda keistimewaan dari Allah untuk hamba-Nya yang terpilih.\n\n**Peristiwa Pembelahan Dada:**\nKetika Rasulullah ﷺ berusia dua atau tiga tahun, terjadilah peristiwa pembelahan dada yang mulia. Dua malaikat mendatangi beliau, membaringkan beliau, membedah dada beliau, mengeluarkan hati beliau, membersihkannya dari noda hitam, kemudian memasukkannya kembali. Peristiwa ini merupakan persiapan Allah untuk misi kenabian yang agung.`,
      `BAB 2 — AWAL KENABIAN\n\nKetika Muhammad ﷺ menginjak usia empat puluh tahun, Allah menghendaki untuk memuliakan beliau dengan kenabian dan mengasihi para hamba dengan mengutus beliau sebagai rasul.\n\nPersiapan-persiapan yang mendahului turunnya wahyu:\n\n**Tahannuts (Menyendiri untuk Beribadah):**\nSebelum diangkat menjadi nabi, Rasulullah ﷺ sudah sering menyendiri di Gua Hira' untuk beribadah dan bertafakur. Beliau meninggalkan suasana masyarakat yang penuh kerusakan dan menyendiri selama beberapa hari. Beliau bekal makanan, kemudian kembali ke Khadijah radhiyallahu 'anha untuk mengambil bekal lagi.\n\nIni berlangsung terus-menerus sampai datang kebenaran saat beliau berada di Gua Hira'. Sebelum itu, beliau juga sudah sering mengalami mimpi yang benar (ru'ya shadiqah). Mimpi-mimpi beliau selalu terbukti, seperti fajar yang menyingsing.\n\nAl-Hafizh Ibnu Hajar Al-'Asqalani rahimahullah berkata: "Hikmah diberikannya mimpi yang benar sebelum turunnya wahyu adalah untuk mempersiapkan Nabi ﷺ agar tidak merasa kaget ketika menerima wahyu, karena mimpi merupakan salah satu bagian dari kenabian."`,
      `2.1 WAHYU PERTAMA\n\nDiriwayatkan oleh Al-Bukhari dari Aisyah radhiyallahu 'anha, istri Nabi ﷺ:\n\n"Pertama kali wahyu diturunkan kepada Rasulullah ﷺ adalah berupa mimpi yang benar dalam tidur. Tidaklah beliau bermimpi kecuali mimpi itu datang seperti cahaya subuh. Kemudian beliau diberikan kecintaan untuk menyendiri (khulwah). Beliau biasa menyendiri di Gua Hira' dan bertahannuts di dalamnya — yaitu beribadah — selama beberapa malam, sebelum beliau kembali ke keluarganya dan mempersiapkan diri untuk itu.\n\nKemudian datanglah malaikat (Jibril) kepadanya dan berkata: 'Iqra!' (Bacalah!). Beliau menjawab: 'Aku tidak bisa membaca.' Maka malaikat memelukku dengan erat hingga aku kepayahan, kemudian melepaskanku dan berkata lagi: 'Iqra!' Aku menjawab: 'Aku tidak bisa membaca.' Maka ia memelukku untuk kedua kalinya hingga aku kepayahan, kemudian melepaskanku dan berkata: 'Iqra!' Aku menjawab: 'Aku tidak bisa membaca.' Maka ia memelukku untuk ketiga kalinya hingga aku kepayahan, kemudian melepaskanku dan berkata:\n\n'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ — Bacalah dengan menyebut nama Tuhanmu yang menciptakan.' (QS. Al-'Alaq: 1)"`,
      `2.2 DAKWAH SECARA RAHASIA\n\nSetelah turunnya wahyu, Rasulullah ﷺ mulai berdakwah secara rahasia selama kurang lebih tiga tahun. Orang-orang pertama yang menerima Islam:\n\n**1. Khadijah binti Khuwailid radhiyallahu 'anha**\nIstri Rasulullah ﷺ adalah orang yang pertama kali beriman. Ia langsung membenarkan beliau dan menenangkan hatinya yang gelisah. Ia berkata: "Demi Allah, Allah tidak akan pernah menghinakanmu. Engkau selalu menyambung silaturahmi, memikul beban orang lemah, memberi orang miskin, memuliakan tamu, dan menolong orang yang tertimpa musibah."\n\n**2. Ali bin Abu Thalib radhiyallahu 'anhu**\nSepupu Rasulullah ﷺ yang saat itu masih berusia sekitar sepuluh tahun. Ia adalah orang pertama yang masuk Islam dari kalangan anak-anak.\n\n**3. Zaid bin Haritsah radhiyallahu 'anhu**\nBekas budak yang telah dimerdekakan dan dijadikan anak angkat oleh Rasulullah ﷺ. Ia adalah orang pertama yang masuk Islam dari kalangan hamba sahaya yang dimerdekakan.\n\n**4. Abu Bakar Ash-Shiddiq radhiyallahu 'anhu**\nSahabat karib Rasulullah ﷺ sejak masa jahiliyyah. Ia adalah orang pertama yang masuk Islam dari kalangan laki-laki dewasa yang merdeka.`,
      `BAB 3 — HIJRAH KE MADINAH\n\nPenyiksaan terhadap kaum muslimin semakin meningkat, sementara mereka belum memiliki kekuatan yang cukup untuk menghadapinya secara terbuka. Allah Ta'ala kemudian mengizinkan Rasulullah ﷺ untuk berhijrah ke Madinah sebagai babak baru dalam sejarah Islam.\n\nLatar belakang Hijrah:\n\nSetelah Perjanjian 'Aqabah Kedua, orang-orang Quraisy mengetahui bahwa Rasulullah ﷺ memiliki basis kekuatan di Madinah. Mereka semakin khawatir dengan penyebaran Islam. Akhirnya mereka mengadakan pertemuan besar di Darun Nadwah (gedung pertemuan) untuk membahas bagaimana menghentikan Rasulullah ﷺ.\n\nSetelah berdiskusi panjang, mereka menyepakati rencana pembunuhan berjamaah terhadap Rasulullah ﷺ: setiap kabilah mengirimkan seorang pemuda yang kuat untuk bersama-sama menyerang Rasulullah ﷺ, sehingga darahnya tersebar di antara semua kabilah dan Bani Hasyim tidak akan mampu menuntut balas.\n\nAllah Ta'ala mewahyukan rencana jahat tersebut kepada Rasulullah ﷺ dan memerintahkannya untuk segera berhijrah. Maka Rasulullah ﷺ meminta Abu Bakar untuk menemaninya dalam perjalanan yang bersejarah tersebut.`,
      `3.1 PERSIAPAN HIJRAH\n\nRasulullah ﷺ melakukan beberapa persiapan sebelum hijrah:\n\n**Meninggalkan Ali bin Abu Thalib di Makkah:**\nBeliau meminta Ali radhiyallahu 'anhu untuk tidur di tempat tidurnya dan mengembalikan barang-barang titipan yang ada pada beliau kepada pemiliknya masing-masing. Meskipun kaum Quraisy memusuhi Nabi ﷺ, mereka masih mempercayakan barang-barang berharga mereka kepada beliau karena kejujurannya.\n\n**Perjalanan menuju Gua Tsur:**\nPada malam yang telah ditentukan, Rasulullah ﷺ keluar dari rumahnya dengan tenang. Para pemuda Quraisy yang mengepung rumah beliau tidak dapat melihatnya karena Allah menutup pandangan mereka. Beliau menaburkan debu ke arah mereka sambil membaca ayat: "Dan Kami adakan di hadapan mereka dinding dan di belakang mereka dinding (pula), dan Kami tutup (mata) mereka sehingga mereka tidak dapat melihat." (QS. Yasin: 9)\n\n**Di Gua Tsur:**\nRasulullah ﷺ dan Abu Bakar bersembunyi di Gua Tsur selama tiga malam. Anak-anak Abu Bakar bertugas menyampaikan informasi tentang situasi Makkah, sedangkan hamba sahaya Abu Bakar bertugas menggembala kambing dan menghapus jejak kaki mereka.`,
      `3.2 TIBA DI MADINAH\n\nSetelah tiga malam di Gua Tsur, Rasulullah ﷺ dan Abu Bakar melanjutkan perjalanan dengan ditemani oleh Abdullah bin Uraiqith Al-Laitsi sebagai penunjuk jalan. Mereka mengambil jalan yang tidak lazim untuk menghindari pengejaran kaum Quraisy.\n\nPerjalanan ini berlangsung selama kurang lebih dua minggu dengan penuh rintangan dan bahaya. Sepanjang perjalanan, keduanya mendapat pertolongan dari Allah dan dari orang-orang yang beriman.\n\n**Tiba di Quba:**\nRasulullah ﷺ tiba di Quba (pinggiran Madinah) pada hari Senin, 12 Rabi'ul Awwal, tahun pertama Hijriyah — yang bertepatan dengan 24 September 622 M. Di sini beliau tinggal selama beberapa hari dan mendirikan Masjid Quba, yang merupakan masjid pertama yang dibangun dalam Islam.\n\n**Memasuki Kota Madinah:**\nKemudian Rasulullah ﷺ melanjutkan perjalanan ke Madinah. Penduduk Madinah menyambutnya dengan penuh kegembiraan. Orang-orang keluar dari rumah-rumah mereka, anak-anak perempuan naik ke atap-atap rumah sambil menyanyikan syair penyambutan. Ini adalah momen bersejarah yang mengawali babak baru dalam sejarah peradaban Islam — era Madinah yang gemilang.`,
    ],
  },
  "2": {
    toc: [
      { title: "Bab 1 — Fungsi & Limit", page: 0 },
      { title: "1.1 Fungsi dan Representasinya", page: 1 },
      { title: "1.2 Limit Fungsi", page: 2 },
      { title: "1.3 Hukum-hukum Limit", page: 3 },
      { title: "Bab 2 — Turunan", page: 4 },
      { title: "2.1 Definisi Turunan", page: 5 },
      { title: "2.2 Aturan Diferensiasi", page: 6 },
      { title: "Bab 3 — Integral", page: 7 },
      { title: "3.1 Integral Tak Tentu", page: 8 },
      { title: "3.2 Teorema Dasar Kalkulus", page: 9 },
    ],
    pages: [
      `BAB 1 — FUNGSI DAN LIMIT\n\nKalkulus merupakan cabang matematika yang mempelajari perubahan. Sama halnya dengan geometri yang mempelajari bentuk, dan aljabar yang mempelajari operasi dan penerapannya untuk memecahkan persamaan, kalkulus telah menjadi alat matematika yang sangat penting dan digunakan secara luas dalam sains dan teknik.\n\nSeorang matematikawan Skotlandia, James Gregory (1638-1675), dan seorang matematikawan Inggris, Isaac Barrow (1630-1677), menemukan hubungan antara diferensiasi dan integrasi, yang merupakan dua proses utama dalam kalkulus. Isaac Newton (1642-1727) dari Inggris dan Gottfried Wilhelm Leibniz (1646-1716) dari Jerman kemudian secara independen mengembangkan kalkulus sebagai suatu cabang ilmu matematika yang utuh.\n\nBagian utama pertama dari buku ini membahas kalkulus diferensial. Topik-topik utama meliputi: fungsi, limit, turunan, dan penggunaan turunan. Bagian utama kedua membahas kalkulus integral. Topik-topik utama meliputi: integral tak tentu, integral tentu, Teorema Dasar Kalkulus, dan penggunaan integral dalam geometri dan fisika.`,
      `1.1 FUNGSI DAN REPRESENTASINYA\n\nSebuah fungsi f adalah aturan yang mengaitkan setiap elemen x dalam sebuah himpunan D dengan tepat satu elemen, yang disebut f(x), dalam sebuah himpunan E.\n\nKita biasanya mempertimbangkan fungsi di mana himpunannya adalah himpunan bilangan real. Himpunan D disebut domain (daerah asal) dari fungsi tersebut. Angka f(x) adalah nilai dari f pada x dan dibaca "f dari x". Ranah (range) dari f adalah himpunan semua nilai yang mungkin dari f(x) ketika x berubah-ubah di seluruh domain.\n\n**Empat cara mewakili fungsi:**\n1. Secara verbal (dengan deskripsi kata-kata)\n2. Secara numerik (melalui sebuah tabel nilai)\n3. Secara visual (dengan sebuah grafik)\n4. Secara aljabar (dengan rumus eksplisit)\n\n**Grafik Fungsi:**\nJika f adalah fungsi dengan domain D, maka grafik dari f adalah himpunan pasangan terurut:\n{ (x, f(x)) | x ∈ D }\n\nDengan kata lain, grafik dari f terdiri dari semua titik (x, y) di bidang koordinat sedemikian sehingga y = f(x) dan x berada dalam domain dari f. Grafik dari f memberikan gambaran visual mengenai fungsi tersebut: kita dapat membaca nilai dari f(x) dari grafik sebagai tinggi grafik di atas titik x.`,
      `1.2 LIMIT FUNGSI\n\nSeorang kalkulus abad ke-17 memiliki gagasan untuk menemukan garis singgung pada sebuah kurva pada sebuah titik, P, dengan terlebih dahulu mengambil garis yang melalui P dan sebuah titik terdekat Q pada kurva, dan kemudian membiarkan Q mendekati P sepanjang kurva.\n\n**Definisi Intuitif Limit:**\nMisalkan f(x) didefinisikan ketika x mendekati a (tetapi tidak harus pada a itu sendiri). Kemudian kita tulis:\n\nlim f(x) = L\nx→a\n\ndan kita katakan "limit dari f(x), ketika x mendekati a, sama dengan L" jika kita bisa membuat nilai-nilai dari f(x) semendekati mungkin dengan L (semendekati yang kita inginkan) dengan cara mengambil x cukup dekat dengan a (dari kedua sisi) tetapi tidak sama dengan a.\n\n**Pendekatan dari Satu Sisi:**\nKita tulis: lim f(x) = L jika kita bisa membuat nilai-nilai dari f(x) semendekati L dengan mengambil x cukup dekat dengan a dan x lebih besar dari a. Limit dari kiri: lim f(x) = L.\n\nTheorema: lim f(x) = L jika dan hanya jika lim f(x) = L dan lim f(x) = L\n                x→a                           x→a⁻            x→a⁺`,
      `1.3 HUKUM-HUKUM LIMIT\n\nMisalkan c adalah konstanta dan bahwa limit-limit berikut ada:\nlim f(x) = L  dan  lim g(x) = M\nx→a                  x→a\n\nMaka berlaku hukum-hukum berikut:\n\n**1. Hukum Penjumlahan:**\nlim [f(x) + g(x)] = L + M\nx→a\n\n**2. Hukum Pengurangan:**\nlim [f(x) - g(x)] = L - M\nx→a\n\n**3. Hukum Perkalian dengan Konstanta:**\nlim [cf(x)] = cL\nx→a\n\n**4. Hukum Perkalian:**\nlim [f(x) · g(x)] = L · M\nx→a\n\n**5. Hukum Pembagian:**\nlim [f(x) / g(x)] = L / M  (jika M ≠ 0)\nx→a\n\n**6. Hukum Perpangkatan:**\nlim [f(x)]ⁿ = Lⁿ\nx→a\n\n**Teorema Sandwich (Squeeze Theorem):**\nJika f(x) ≤ g(x) ≤ h(x) ketika x mendekati a (kecuali mungkin pada a sendiri) dan lim f(x) = lim h(x) = L, maka lim g(x) = L.`,
      `BAB 2 — TURUNAN\n\nKita sekarang menyelidiki masalah garis singgung lebih dekat. Jika sebuah kurva C memiliki persamaan y = f(x) dan kita ingin mencari garis singgung pada C di titik P(a, f(a)), maka kita mempertimbangkan titik terdekat Q(x, f(x)), dimana x ≠ a, dan menghitung kemiringan garis potong PQ:\n\nm_PQ = [f(x) - f(a)] / (x - a)\n\nKemudian kita membiarkan Q mendekati P sepanjang kurva C dengan cara membiarkan x mendekati a. Jika m_PQ mendekati sebuah angka m, maka kita mendefinisikan garis singgung t sebagai garis yang melalui P dengan kemiringan m.\n\nDefinisi: Kemiringan garis singgung pada kurva y = f(x) di titik P(a, f(a)) adalah:\n\nm = lim [f(x) - f(a)] / (x - a)\n    x→a\n\njika limit ini ada.\n\nEkspresi ini juga muncul ketika kita menghitung laju perubahan dalam banyak situasi. Misalkan y adalah kuantitas yang bergantung pada variabel lain x, yaitu y = f(x). Laju perubahan sesaat dari y terhadap x pada x = a adalah kemiringan garis singgung pada grafik f di P(a, f(a)):`,
      `2.1 DEFINISI TURUNAN\n\nDefinisi Turunan:\nTurunan dari sebuah fungsi f pada angka a, ditulis f'(a), adalah:\n\nf'(a) = lim [f(a + h) - f(a)] / h\n         h→0\n\njika limit ini ada.\n\nJika kita menuliskan x = a + h, maka h = x - a dan h mendekati 0 ketika dan hanya ketika x mendekati a. Oleh karena itu, pernyataan yang setara dari definisi turunan adalah:\n\nf'(a) = lim [f(x) - f(a)] / (x - a)\n         x→a\n\n**Interpretasi Turunan:**\n1. **Geometri:** f'(a) adalah kemiringan dari garis singgung pada y = f(x) di titik (a, f(a)).\n\n2. **Fisika:** Jika s = f(t) adalah fungsi posisi dari sebuah partikel yang bergerak, maka f'(a) adalah kecepatan sesaat dari partikel pada t = a.\n\n3. **Umum:** f'(a) adalah laju perubahan sesaat dari y = f(x) terhadap x ketika x = a.\n\nFungsi yang dapat diturunkan disebut differentiable pada a. Sebuah fungsi dapat diturunkan jika turunannya ada pada setiap titik dalam domainnya.`,
      `2.2 ATURAN-ATURAN DIFERENSIASI\n\nSeandainya kita harus menghitung turunan-turunan dengan menggunakan definisi setiap saat, maka tugas itu menjadi sangat melelahkan dan membutuhkan banyak waktu. Untungnya, ada aturan-aturan yang memperbolehkan kita untuk menurunkan fungsi-fungsi baru dari fungsi-fungsi yang telah kita ketahui.\n\n**Aturan Pangkat:**\nd/dx (xⁿ) = nxⁿ⁻¹\n\nContoh: d/dx (x⁵) = 5x⁴\n\n**Aturan Penjumlahan:**\nd/dx [f(x) + g(x)] = f'(x) + g'(x)\n\n**Aturan Hasil Kali (Product Rule):**\nd/dx [f(x)g(x)] = f(x)g'(x) + g(x)f'(x)\n\nAtau dalam notasi Leibniz: d/dx (uv) = u(dv/dx) + v(du/dx)\n\n**Aturan Hasil Bagi (Quotient Rule):**\nd/dx [f(x)/g(x)] = [g(x)f'(x) - f(x)g'(x)] / [g(x)]²\n\n**Aturan Rantai (Chain Rule):**\nJika g dapat diturunkan pada x dan f dapat diturunkan pada g(x), maka fungsi komposit h = f∘g yang didefinisikan oleh h(x) = f(g(x)) dapat diturunkan pada x dan:\nh'(x) = f'(g(x)) · g'(x)`,
      `BAB 3 — INTEGRAL\n\nDalam bab ini kita akan mempelajari kebalikan dari proses diferensiasi, yaitu proses integrasi. Konsep ini memiliki dua makna utama:\n\n1. **Antiderivatif (Anti-turunan):** Mencari fungsi yang turunannya diketahui.\n2. **Integral Tentu:** Menghitung luas daerah di bawah kurva.\n\nSejarah integral berkaitan erat dengan masalah penentuan luas daerah yang dibatasi oleh kurva. Archimedes pada sekitar 250 SM telah berhasil menentukan luas di bawah kurva parabola menggunakan metode kelelahan (method of exhaustion).\n\nNamun baru pada abad ke-17, Newton dan Leibniz menemukan hubungan fundamental antara integral dan turunan, yang kemudian dikenal sebagai Teorema Dasar Kalkulus. Penemuan ini merupakan salah satu pencapaian intelektual terbesar dalam sejarah matematika.\n\n**Notasi Integral:**\nIntegral tak tentu dari f ditulis sebagai:\n\n∫ f(x) dx\n\nDibaca sebagai "integral dari f(x) dx" atau "anti-derivatif dari f(x)". Simbol ∫ adalah tanda integral yang merupakan S yang diperpanjang, singkatan dari kata Latin "summa" (jumlah).`,
      `3.1 INTEGRAL TAK TENTU\n\nDefinisi: Sebuah fungsi F disebut antiderivatif dari f pada sebuah interval I jika F'(x) = f(x) untuk semua x dalam I.\n\nKetika kita menghitung antiderivatif dari sebuah fungsi, kita menyebutnya sebagai integral tak tentu dan menggunakan notasi:\n\n∫ f(x) dx = F(x) + C\n\ndimana C adalah konstanta integrasi yang mewakili famili semua antiderivatif.\n\n**Tabel Integral Tak Tentu Dasar:**\n\n∫ k dx = kx + C  (k adalah konstanta)\n∫ xⁿ dx = xⁿ⁺¹/(n+1) + C  (n ≠ -1)\n∫ 1/x dx = ln|x| + C\n∫ eˣ dx = eˣ + C\n∫ sin x dx = -cos x + C\n∫ cos x dx = sin x + C\n∫ sec²x dx = tan x + C\n∫ csc²x dx = -cot x + C\n∫ sec x tan x dx = sec x + C\n\n**Aturan Integral:**\n\n∫ [f(x) + g(x)] dx = ∫ f(x) dx + ∫ g(x) dx\n∫ c·f(x) dx = c ∫ f(x) dx`,
      `3.2 TEOREMA DASAR KALKULUS\n\nTeorema Dasar Kalkulus menghubungkan dua cabang kalkulus: kalkulus diferensial dan kalkulus integral. Teorema ini merupakan salah satu penemuan matematika terpenting dan paling berguna sepanjang sejarah.\n\n**Teorema Dasar Kalkulus, Bagian 1:**\nJika f kontinu pada [a, b], maka fungsi g yang didefinisikan oleh:\n\ng(x) = ∫ₐˣ f(t) dt,  a ≤ x ≤ b\n\nkontinu pada [a, b] dan dapat diturunkan pada (a, b), serta g'(x) = f(x).\n\n**Teorema Dasar Kalkulus, Bagian 2:**\nJika f kontinu pada [a, b], maka:\n\n∫ₐᵇ f(x) dx = F(b) - F(a)\n\ndimana F adalah sembarang antiderivatif dari f, yaitu fungsi yang memenuhi F' = f.\n\n**Metode Substitusi:**\nMetode substitusi untuk integral tak tentu sesuai dengan Aturan Rantai untuk turunan. Jika u = g(x) adalah fungsi yang dapat diturunkan yang rentangnya adalah sebuah interval I dan f kontinu pada I, maka:\n\n∫ f(g(x))g'(x) dx = ∫ f(u) du\n\nMetode ini sangat berguna untuk menyederhanakan integral yang kompleks menjadi bentuk yang lebih sederhana dan dapat diselesaikan dengan formula dasar.`,
    ],
  },
  "6": {
    toc: [
      { title: "Bab 1 — Pengantar AI", page: 0 },
      { title: "1.1 Definisi Kecerdasan Buatan", page: 1 },
      { title: "Bab 2 — Agen Cerdas", page: 2 },
      { title: "2.1 Struktur Agen", page: 3 },
      { title: "Bab 3 — Pencarian", page: 4 },
      { title: "3.1 Masalah Pencarian", page: 5 },
      { title: "3.2 BFS dan DFS", page: 6 },
      { title: "Bab 4 — Machine Learning", page: 7 },
      { title: "4.1 Supervised Learning", page: 8 },
      { title: "4.2 Neural Networks", page: 9 },
    ],
    pages: [
      `BAB 1 — PENGANTAR KECERDASAN BUATAN\n\nKecerdasan Buatan (Artificial Intelligence atau AI) adalah cabang Teknik Informatika yang bertujuan untuk menciptakan sistem yang dapat melakukan tugas-tugas yang biasanya membutuhkan kecerdasan manusia. Ini termasuk hal-hal seperti visual perception, pengenalan suara, pengambilan keputusan, dan translasi bahasa.\n\nBuku ini membahas AI dalam konteks yang luas dan komprehensif. Kami mendefinisikan AI sebagai upaya untuk membuat mesin yang melakukan hal-hal yang akan dianggap cerdas jika dilakukan oleh manusia.\n\nSejarah AI dimulai dari mimpi-mimpi kuno tentang robot cerdas hingga ilmu komputer modern. Konferensi Dartmouth pada tahun 1956 dianggap sebagai kelahiran resmi AI sebagai bidang ilmiah. Para peneliti awal sangat optimis — Herbert Simon meramalkan bahwa "mesin akan mampu, dalam dua puluh tahun, melakukan pekerjaan apa pun yang dapat dilakukan manusia."\n\nTentu saja prediksi tersebut terlalu optimis. Namun AI telah berkembang jauh dan saat ini digunakan dalam: mesin pencari web, pengenalan suara (Siri, Alexa), mobil otonom, deteksi penipuan kartu kredit, rekomendasi di Netflix dan Spotify, dan banyak lagi.`,
      `1.1 DEFINISI KECERDASAN BUATAN\n\nAda empat pendekatan dalam mendefinisikan AI:\n\n**1. Acting Humanly — Turing Test Approach:**\nAlan Turing (1950) mendefinisikan kecerdasan melalui Turing Test. Sebuah komputer dianggap cerdas jika seorang interogator manusia tidak dapat membedakannya dari manusia berdasarkan percakapan teks. Untuk lulus tes ini, komputer perlu: Natural Language Processing, representasi pengetahuan, penalaran otomatis, dan machine learning.\n\n**2. Thinking Humanly — Cognitive Modeling Approach:**\nUntuk mengatakan bahwa sebuah program berpikir seperti manusia, kita harus mengetahui bagaimana manusia berpikir. Ini dipelajari melalui introspeksi, eksperimen psikologis, dan pencitraan otak.\n\n**3. Thinking Rationally — Laws of Thought Approach:**\nAristoteles mengkodifikasikan penalaran yang "benar" melalui syllogisms. Tradisi logis dalam AI bertujuan untuk menciptakan sistem yang mampu bernalar dari premis ke kesimpulan yang valid.\n\n**4. Acting Rationally — Rational Agent Approach:**\nAgen rasional adalah entitas yang bertindak untuk mencapai hasil terbaik (atau hasil terbaik yang diharapkan). Pendekatan ini lebih umum dari pendekatan "laws of thought" karena inferensi yang benar hanyalah salah satu mekanisme untuk mencapai tindakan rasional.`,
      `BAB 2 — AGEN CERDAS\n\nSeekor manusia, seekor robot, sebuah termostat — apa yang menghubungkan ketiga hal ini? Mereka semua adalah agen. Sebuah agen adalah entitas apapun yang dapat dipandang sebagai mempersepsi lingkungannya melalui sensor dan bertindak pada lingkungan tersebut melalui aktuator.\n\nUntuk setiap kemungkinan urutan persepsi, agen rasional harus memilih tindakan yang diharapkan akan memaksimalkan ukuran kinerjanya, berdasarkan bukti yang diberikan oleh urutan persepsi dan pengetahuan apa pun yang dimiliki agen.\n\n**Lingkungan Tugas:**\nSebelum merancang agen, kita harus memikirkan dengan cermat tentang lingkungan tugas dimana agen tersebut akan beroperasi. Ini mencakup:\n\n• **Percept Sequence:** Urutan lengkap dari semua yang telah dirasakan agen hingga saat ini.\n• **Agent Function:** Fungsi yang memetakan setiap urutan persepsi yang mungkin ke sebuah tindakan.\n• **Agent Program:** Implementasi konkrit dari fungsi agen yang berjalan pada arsitektur komputasi fisik.\n\nPertanyaan kunci: Seberapa rasional sebuah agen bergantung pada empat hal: (1) ukuran kinerja yang mendefinisikan kriteria kesuksesan, (2) pengetahuan prior agen tentang lingkungan, (3) tindakan yang dapat dilakukan agen, dan (4) urutan persepsi agen hingga saat ini.`,
      `2.1 STRUKTUR AGEN\n\nTugas AI adalah merancang program agen yang mengimplementasikan fungsi agen yang memetakan persepsi ke tindakan. Kami berasumsi bahwa program ini akan berjalan pada semacam mesin komputasi dengan sensor fisik dan aktuator.\n\n**Empat Jenis Dasar Program Agen:**\n\n1. **Simple Reflex Agents:**\nAgen ini memilih tindakan berdasarkan persepsi saat ini saja, mengabaikan sisa dari sejarah persepsi. Agen ini bekerja hanya jika lingkungan sepenuhnya dapat diobservasi. Contoh: jika mobil di depan mengerem maka rem.\n\n2. **Model-Based Reflex Agents:**\nAgen ini mempertahankan keadaan internal untuk melacak aspek-aspek dunia yang tidak dapat dilihat dari persepsi saat ini. Ini membutuhkan model dunia — pengetahuan tentang bagaimana dunia berkembang secara independen dari agen, dan bagaimana tindakan agen mempengaruhi dunia.\n\n3. **Goal-Based Agents:**\nAgen ini menggabungkan informasi tujuan dengan informasi dunia untuk memilih tindakan yang mencapai tujuan. Pencarian dan perencanaan adalah subfield AI yang didedikasikan untuk menemukan urutan tindakan yang mencapai tujuan agen.\n\n4. **Utility-Based Agents:**\nTujuan saja tidak cukup untuk menghasilkan perilaku berkualitas tinggi dalam kebanyakan lingkungan. Fungsi utilitas memetakan keadaan dunia ke angka tunggal yang mewakili tingkat kebahagiaan yang terkait dengan keadaan tersebut.`,
      `BAB 3 — PEMECAHAN MASALAH DENGAN PENCARIAN\n\nPerhatikan seorang agen yang berbasis tujuan yang memiliki satu tujuan: untuk pergi ke kota Roma. Agen berada di Bucharest dan perlu menemukan urutan tindakan yang akan membawanya ke sana.\n\nPendekatan ini disebut pencarian (search). Agen pertama-tama mencari urutan tindakan yang mengarah ke keadaan tujuan, dan kemudian mengeksekusi urutan tersebut satu tindakan demi satu.\n\n**Formulasi Masalah:**\nSebuah masalah dapat didefinisikan secara formal oleh empat komponen:\n\n1. **Keadaan Awal (Initial State):** Keadaan tempat agen memulai. Contoh: In(Bucharest)\n\n2. **Fungsi Aksi (Action Function):** Deskripsi aksi-aksi yang mungkin tersedia untuk agen. ACTIONS(In(Arad)) = { Go(Zerind), Go(Timisoara), Go(Sibiu) }\n\n3. **Model Transisi (Transition Model):** Deskripsi tentang apa yang dilakukan setiap aksi. RESULT(In(Arad), Go(Zerind)) = In(Zerind)\n\n4. **Pengujian Tujuan (Goal Test):** Menentukan apakah keadaan tertentu adalah keadaan tujuan. Contoh: { In(Bucharest) }\n\n5. **Fungsi Biaya Jalur (Path Cost Function):** Memberikan nilai numerik untuk setiap jalur.`,
      `3.1 MASALAH PENCARIAN DAN STRATEGI\n\nSebuah solusi untuk sebuah masalah adalah sebuah urutan tindakan yang mengarah dari keadaan awal ke keadaan tujuan. Kualitas solusi diukur oleh fungsi biaya jalur, dan solusi optimal adalah solusi dengan biaya jalur terendah di antara semua solusi.\n\n**Ruang Keadaan (State Space):**\nHimpunan semua keadaan yang dapat dicapai dari keadaan awal oleh setiap urutan tindakan. Ruang keadaan membentuk grafik di mana simpul-simpul adalah keadaan dan tepi-tepi adalah tindakan.\n\n**Kriteria Evaluasi Strategi Pencarian:**\n1. **Completeness:** Apakah algoritma dijamin menemukan solusi jika ada?\n2. **Optimality:** Apakah strategi menemukan solusi optimal?\n3. **Time Complexity:** Berapa lama waktu yang dibutuhkan untuk menemukan solusi?\n4. **Space Complexity:** Berapa banyak memori yang dibutuhkan?\n\nKompleksitas dinyatakan dalam tiga kuantitas:\n• b — branching factor (jumlah successor maksimum dari setiap simpul)\n• d — kedalaman simpul tujuan yang paling dangkal\n• m — panjang maksimum path manapun di ruang keadaan`,
      `3.2 BREADTH-FIRST SEARCH (BFS) DAN DEPTH-FIRST SEARCH (DFS)\n\n**Breadth-First Search (BFS):**\nBFS mengekspansi simpul akar, kemudian semua penerus simpul akar, kemudian penerus mereka, dan seterusnya. Secara umum, semua simpul pada kedalaman d dieksplor sebelum simpul-simpul pada kedalaman d+1.\n\nFungsi BFS yang sederhana:\nBFS(problem):\n  node = NODE(problem.INITIAL)\n  if problem.IS-GOAL(node.STATE): return node\n  frontier = a FIFO queue, dengan node sebagai elemen\n  reached = {problem.INITIAL}\n  while frontier tidak kosong:\n    node = POP(frontier)\n    for each child in EXPAND(problem, node):\n      s = child.STATE\n      if problem.IS-GOAL(s): return child\n      if s not in reached:\n        add s to reached\n        add child to frontier\n  return failure\n\n**Depth-First Search (DFS):**\nDFS selalu mengekspansi simpul paling dalam terlebih dahulu dalam batas saat ini. Pencarian segera berlanjut ke tingkat kedalaman berikutnya setelah mencapai daun pohon pencarian.\n\nBFS complete dan optimal jika biaya langkah = 1, tetapi membutuhkan O(bᵈ) memori. DFS tidak optimal dan tidak complete, tetapi hanya membutuhkan O(bm) memori.`,
      `BAB 4 — MACHINE LEARNING\n\nMachine learning adalah bidang yang memberikan komputer kemampuan untuk belajar tanpa secara eksplisit diprogram (Arthur Samuel, 1959). Sebuah program komputer dikatakan belajar dari pengalaman E dengan hormat terhadap beberapa kelas tugas T dan ukuran kinerja P, jika kinerjanya pada tugas-tugas dalam T, yang diukur oleh P, meningkat dengan pengalaman E.\n\n**Jenis-jenis Machine Learning:**\n\n1. **Supervised Learning (Pembelajaran Terawasi):**\nDiberikan set pelatihan contoh-contoh berlabel, tujuannya adalah mempelajari fungsi pemetaan dari masukan ke keluaran.\n\n2. **Unsupervised Learning (Pembelajaran Tak Terawasi):**\nDiberikan set contoh yang tidak berlabel, tujuannya adalah menemukan struktur dalam data.\n\n3. **Reinforcement Learning (Pembelajaran Penguatan):**\nAgen belajar dengan berinteraksi dengan lingkungan, menerima hadiah atau hukuman atas tindakannya.\n\n4. **Semi-supervised Learning:**\nKombinasi dari sedikit data berlabel dan banyak data tidak berlabel selama pelatihan.\n\nDalam beberapa tahun terakhir, machine learning — terutama deep learning — telah mencapai terobosan yang luar biasa dalam pengenalan gambar, pemrosesan bahasa alami, dan banyak domain lainnya.`,
      `4.1 SUPERVISED LEARNING\n\nSupervised learning adalah jenis machine learning yang paling umum digunakan dalam aplikasi praktis. Kita diberikan set pelatihan {(x₁,y₁), (x₂,y₂), ..., (xₙ,yₙ)} dimana xᵢ adalah vektor fitur dan yᵢ adalah label (output yang diinginkan).\n\n**Dua Tugas Utama Supervised Learning:**\n\n1. **Klasifikasi (Classification):**\nOutput yᵢ adalah label diskrit dari himpunan terbatas. Contoh: klasifikasi email spam/bukan-spam, diagnosis medis (sakit/sehat), pengenalan gambar (kucing/anjing/mobil).\n\n2. **Regresi (Regression):**\nOutput yᵢ adalah nilai kontinu. Contoh: prediksi harga rumah, prediksi suhu, prediksi harga saham.\n\n**Bias-Variance Tradeoff:**\nSalah satu konsep terpenting dalam machine learning adalah tradeoff antara bias dan variance:\n\n• **High Bias (Underfitting):** Model terlalu sederhana dan tidak dapat menangkap pola dalam data pelatihan. Model ini buruk pada data pelatihan dan data baru.\n\n• **High Variance (Overfitting):** Model terlalu kompleks dan terlalu menyesuaikan diri dengan noise dalam data pelatihan. Model ini baik pada data pelatihan tetapi buruk pada data baru.\n\nTujuannya adalah menemukan keseimbangan yang tepat melalui cross-validation, regularization, dan pemilihan hyperparameter yang tepat.`,
      `4.2 NEURAL NETWORKS DAN DEEP LEARNING\n\nJaringan saraf tiruan (artificial neural networks) adalah model komputasi yang terinspirasi oleh struktur otak biologis. Mereka terdiri dari lapisan-lapisan simpul yang saling terhubung (neuron) yang memproses informasi.\n\n**Arsitektur Dasar Neural Network:**\n\n• **Input Layer:** Menerima data mentah (misalnya, piksel gambar atau kata-kata)\n• **Hidden Layers:** Lapisan perantara yang mengekstrak fitur yang semakin abstrak\n• **Output Layer:** Menghasilkan prediksi akhir\n\n**Fungsi Aktivasi:**\nSetiap neuron menerapkan fungsi aktivasi non-linear:\n• Sigmoid: σ(x) = 1/(1 + e⁻ˣ)\n• ReLU: f(x) = max(0, x)\n• Tanh: tanh(x) = (eˣ - e⁻ˣ)/(eˣ + e⁻ˣ)\n\n**Deep Learning:**\nDeep learning menggunakan neural network dengan banyak lapisan tersembunyi. Ini memungkinkan pembelajaran representasi data yang semakin abstrak dan kompleks.\n\nAplikasi deep learning yang mengubah dunia:\n• **Computer Vision:** ResNet, VGG, EfficientNet\n• **Natural Language Processing:** GPT, BERT, T5\n• **Audio Processing:** Whisper, WaveNet\n• **Reinforcement Learning:** AlphaGo, AlphaStar\n\nBackpropagation adalah algoritma kunci yang memungkinkan pelatihan deep neural networks dengan menghitung gradien dari fungsi loss terhadap semua parameter jaringan.`,
    ],
  },
};

function getEbook(bookId: string): EbookContent | null {
  return ebookLibrary[bookId] ?? null;
}

function EbookPage({ navigate, book }: { navigate: (p: Page) => void; book: Book }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const ebook = getEbook(book.id) ?? { pages: ebookLibrary["1"].pages, toc: ebookLibrary["1"].toc };
  const { pages, toc } = ebook;
  const total = pages.length;

  return (
    <div className="min-h-screen bg-[#12172b] flex flex-col select-none">
      {/* Reader Top Bar */}
      <div className="sticky top-0 z-50 bg-[#003087] px-4 h-14 flex items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <button onClick={() => navigate("book-detail")} className="p-2 rounded-xl hover:bg-white/10 transition-colors shrink-0">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="min-w-0">
            <div className="text-sm font-bold text-white truncate">{book.title}</div>
            <div className="text-white/50 text-[11px] truncate">{book.author}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setFontSize(f => Math.max(12, f - 2))}
            className="w-8 h-8 rounded-lg hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center">A-</button>
          <span className="text-white/50 text-xs w-5 text-center">{fontSize}</span>
          <button onClick={() => setFontSize(f => Math.min(24, f + 2))}
            className="w-8 h-8 rounded-lg hover:bg-white/10 text-white font-bold text-sm flex items-center justify-center">A+</button>
          <div className="w-px h-5 bg-white/20 mx-1.5" />
          <button onClick={() => setShowToc(!showToc)}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors", showToc ? "bg-white/20" : "hover:bg-white/10")}>
            Daftar Isi
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* TOC */}
        {showToc && (
          <aside className="w-60 bg-[#001A4E] border-r border-white/10 py-4 px-3 flex flex-col gap-1 overflow-y-auto shrink-0">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider px-2 mb-2">Daftar Isi</p>
            {toc.map(item => (
              <button key={item.page} onClick={() => { setCurrentPage(item.page); setShowToc(false); }}
                className={cn("text-left px-3 py-2.5 rounded-xl text-sm transition-all",
                  currentPage === item.page ? "bg-white/20 text-white font-semibold" : "text-white/55 hover:bg-white/10 hover:text-white"
                )}>
                {item.title}
              </button>
            ))}
          </aside>
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto flex justify-center py-10 px-4">
          <div className="w-full max-w-[680px]">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <span className="text-xs text-muted-foreground font-medium truncate max-w-[60%]">{book.title}</span>
                <span className="text-xs text-muted-foreground">Hal. {currentPage + 1} / {total}</span>
              </div>
              <div className="px-8 sm:px-12 py-10 min-h-[65vh]">
                <p className="whitespace-pre-line leading-[1.95] text-foreground" style={{ fontSize }}>
                  {pages[currentPage]}
                </p>
              </div>
              <div className="px-8 py-4 border-t border-gray-100 text-center text-xs text-muted-foreground bg-gray-50">
                — {currentPage + 1} —
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="sticky bottom-0 bg-[#003087] border-t border-white/10 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          <ChevronLeft className="w-4 h-4" /> Sebelumnya
        </button>

        <div className="flex items-center gap-1.5">
          {pages.map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i)}
              className={cn("rounded-full transition-all", currentPage === i ? "w-6 h-2.5 bg-[#F5B800]" : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60")} />
          ))}
        </div>

        {currentPage < total - 1 ? (
          <button onClick={() => setCurrentPage(p => p + 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all">
            Selanjutnya <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => navigate("borrow-form")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F5B800] text-[#001A4E] text-sm font-bold hover:bg-[#F5B800]/90 transition-all">
            <BookOpen className="w-4 h-4" /> Pinjam Fisik
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE: FORM PENGEMBALIAN
// ─────────────────────────────────────────
function ReturnFormPage({ navigate, loan }: { navigate: (p: Page) => void; loan: Loan }) {
  const [petugas, setPetugas] = useState("P01");
  const [kondisi, setKondisi] = useState("baik");
  const [catatan, setCatatan] = useState("");
  const [fotoName, setFotoName] = useState("");
  const [setuju, setSetuju] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});

  const today = new Date("2026-06-29");
  const fmt = (d: Date) => d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const isOverdue = loan.status === "terlambat";
  const dueDate = new Date(loan.dueDate);
  const daysLate = Math.max(0, Math.ceil((today.getTime() - dueDate.getTime()) / 86400000));
  const fine = daysLate * 2000;

  const kondisiOptions = [
    { value: "baik", label: "Baik — Tidak ada kerusakan", color: "text-green-700 bg-green-50 border-green-200" },
    { value: "cukup", label: "Cukup Baik — Ada sedikit lipatan/kotor", color: "text-amber-700 bg-amber-50 border-amber-200" },
    { value: "rusak-ringan", label: "Rusak Ringan — Halaman sobek/cover lecet", color: "text-orange-700 bg-orange-50 border-orange-200" },
    { value: "rusak-berat", label: "Rusak Berat — Perlu penggantian buku", color: "text-red-700 bg-red-50 border-red-200" },
  ];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fotoName) e.foto = "Foto bukti pengembalian wajib diunggah.";
    if (!setuju) e.setuju = "Centang persetujuan terlebih dahulu.";
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("loans"); }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FF]">
      <TopNav navigate={navigate} currentPage="loans" unreadCount={2} />
      <motion.div {...pageMotion} className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-5">
          <button onClick={() => navigate("loans")} className="hover:text-[#003087]">Pinjaman Saya</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">Form Pengembalian</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-1">Form Pengembalian Buku</h1>
        <p className="text-muted-foreground text-sm mb-6">Lengkapi data pengembalian dan unggah foto kondisi buku.</p>

        {/* Info Pinjaman */}
        <div className={cn("rounded-2xl border shadow-sm p-5 mb-4", isOverdue ? "bg-red-50 border-red-200" : "bg-white border-border")}>
          <p className={cn("text-xs font-bold uppercase tracking-wide mb-3", isOverdue ? "text-red-600" : "text-muted-foreground")}>
            {isOverdue ? "⚠️ Pinjaman Terlambat" : "Detail Pinjaman"}
          </p>
          <div className="flex gap-4">
            <img src={loan.bookCover} alt={loan.bookTitle} className="w-16 h-[88px] object-cover rounded-xl shadow-sm bg-gray-100 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-foreground line-clamp-2">{loan.bookTitle}</div>
              <div className="text-sm text-muted-foreground">{loan.bookAuthor}</div>
              <div className="flex gap-2 mt-2 flex-wrap text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Dipinjam: {loan.borrowDate}</span>
                <span className={cn("flex items-center gap-1", isOverdue && "text-red-600 font-semibold")}>
                  <Clock className="w-3 h-3" /> Jatuh tempo: {loan.dueDate}
                </span>
              </div>
            </div>
          </div>
          {isOverdue && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-xl">
              <p className="text-sm font-bold text-red-800">Keterlambatan: {daysLate} hari</p>
              <p className="text-sm text-red-700">Total denda yang harus dibayar: <strong>Rp{fine.toLocaleString("id-ID")}</strong></p>
              <p className="text-xs text-red-600 mt-1">Denda wajib dibayar kepada petugas saat pengembalian.</p>
            </div>
          )}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-white/60 rounded-xl p-3 border border-white">
              <div className="text-[11px] text-muted-foreground mb-0.5">ID Pinjaman</div>
              <div className="text-sm font-mono font-semibold text-foreground">{loan.id}</div>
            </div>
            <div className="bg-white/60 rounded-xl p-3 border border-white">
              <div className="text-[11px] text-muted-foreground mb-0.5">Tanggal Pengembalian</div>
              <div className="text-sm font-semibold text-foreground">{fmt(today)}</div>
            </div>
          </div>
        </div>

        {/* Foto Bukti */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-5 mb-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
            Foto Bukti Pengembalian <span className="text-red-500">*</span>
          </p>
          <p className="text-xs text-muted-foreground mb-3">Ambil foto kondisi buku (sampul depan, belakang, dan halaman dalam) sebelum diserahkan ke petugas.</p>
          <label className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all",
            fotoName ? "border-[#003087] bg-[#003087]/5" : "border-border hover:border-[#003087]/50 hover:bg-[#003087]/5",
            errs.foto && "border-red-400 bg-red-50"
          )}>
            <input type="file" accept="image/*" className="hidden" onChange={e => {
              const file = e.target.files?.[0];
              if (file) setFotoName(file.name);
            }} />
            {fotoName ? (
              <>
                <CheckCircle className="w-10 h-10 text-[#003087] mb-2" />
                <p className="text-sm font-semibold text-[#003087]">Foto berhasil dipilih</p>
                <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">{fotoName}</p>
                <p className="text-xs text-[#003087] mt-2 underline">Ganti foto</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                <p className="text-sm font-semibold text-foreground">Klik untuk unggah foto</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG hingga 10MB · Min. 3 foto</p>
              </>
            )}
          </label>
          {errs.foto && <p className="text-xs text-red-500 mt-2">{errs.foto}</p>}
        </div>

        {/* Kondisi Buku */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-5 mb-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
            Kondisi Buku Saat Dikembalikan <span className="text-red-500">*</span>
          </p>
          <div className="flex flex-col gap-2">
            {kondisiOptions.map(opt => (
              <label key={opt.value} className={cn(
                "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                kondisi === opt.value ? `${opt.color} border-2` : "border-border hover:border-[#003087]/30"
              )}>
                <input type="radio" name="kondisi" value={opt.value} checked={kondisi === opt.value}
                  onChange={() => setKondisi(opt.value)} className="accent-[#003087] w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
          {(kondisi === "rusak-ringan" || kondisi === "rusak-berat") && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-700">
              ⚠️ Kerusakan buku akan dikenakan biaya penggantian sesuai kebijakan perpustakaan.
            </div>
          )}
        </div>

        {/* Petugas Jaga */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-5 mb-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
            Petugas yang Menerima Pengembalian <span className="text-red-500">*</span>
          </p>
          <div className="flex flex-col gap-2">
            {petugasList.map(p => (
              <label key={p.id} className={cn(
                "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                petugas === p.id ? "border-[#003087] bg-[#003087]/5" : "border-border hover:border-[#003087]/30"
              )}>
                <input type="radio" name="petugas-return" value={p.id} checked={petugas === p.id}
                  onChange={() => setPetugas(p.id)} className="accent-[#003087] w-4 h-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">{p.nama}</div>
                  <div className="text-xs text-muted-foreground">{p.jabatan} · {p.shift}</div>
                </div>
                {petugas === p.id && <CheckCircle className="w-4 h-4 text-[#003087] shrink-0" />}
              </label>
            ))}
          </div>
        </div>

        {/* Catatan */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-5 mb-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Catatan Tambahan (Opsional)</p>
          <textarea value={catatan} onChange={e => setCatatan(e.target.value)} rows={3}
            placeholder="cth. Ada halaman yang sedikit melipat, atau kondisi buku masih sangat baik..."
            className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087] resize-none" />
        </div>

        {/* Persetujuan */}
        <div className="bg-[#003087]/5 border border-[#003087]/20 rounded-2xl p-4 mb-5">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" checked={setuju} onChange={e => setSetuju(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded accent-[#003087] shrink-0" />
            <span className="text-xs text-foreground font-medium leading-relaxed">
              Saya menyatakan bahwa data yang saya isi adalah benar, dan buku dikembalikan dalam kondisi seperti yang saya pilih di atas. Saya bersedia menanggung biaya kerusakan/denda sesuai ketentuan.
            </span>
          </label>
          {errs.setuju && <p className="text-xs text-red-500 mt-1 ml-6">{errs.setuju}</p>}
        </div>

        <div className="flex gap-3">
          <Btn onClick={() => navigate("loans")} variant="outline" size="lg" className="flex-1">
            <ChevronLeft className="w-4 h-4" /> Batal
          </Btn>
          <Btn onClick={handleSubmit} disabled={loading} size="lg" className="flex-1">
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Memproses...</> : <><Check className="w-4 h-4" /> Konfirmasi Pengembalian</>}
          </Btn>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────
// PAGE: BORROW SUCCESS
// ─────────────────────────────────────────
function BorrowSuccessPage({ navigate, book }: { navigate: (p: Page) => void; book: Book }) {
  return (
    <motion.div {...pageMotion} className="min-h-screen bg-[#F4F7FF] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-border shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Pinjaman Dikonfirmasi!</h1>
          <p className="text-muted-foreground mb-6">Buku Anda berhasil dipinjam.</p>

          <div className="flex items-center gap-4 p-4 bg-[#F4F7FF] rounded-2xl mb-6 text-tersisa">
            <img src={book.cover} alt={book.title} className="w-14 h-20 object-cover rounded-xl shadow-sm bg-gray-100 shrink-0" />
            <div className="min-w-0">
              <div className="font-semibold text-foreground line-clamp-2">{book.title}</div>
              <div className="text-sm text-muted-foreground">{book.author}</div>
              <div className="mt-1.5"><Badge variant="default">{book.category}</Badge></div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center justify-between p-3 bg-[#F4F7FF] rounded-xl">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="w-4 h-4" /> Tanggal Pinjam</div>
              <span className="text-sm font-semibold text-foreground">29 Juni 2026</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 text-sm text-amber-700"><Clock className="w-4 h-4" /> Tanggal Kembali</div>
              <span className="text-sm font-semibold text-amber-800">29 Juli 2026</span>
            </div>
          </div>

          <div className="p-3 bg-[#003087]/5 border border-[#003087]/20 rounded-xl text-xs text-[#003087] mb-6">
            Harap kembalikan buku sebelum 29 Juli 2026. Denda Rp2.000/hari berlaku jika terlambat.
          </div>

          <div className="flex flex-col gap-2">
            <Btn onClick={() => navigate("loans")} size="lg" className="w-full"><BookMarked className="w-4 h-4" /> Lihat Pinjaman Saya</Btn>
            <Btn onClick={() => navigate("login")} variant="outline" size="md" className="w-full">Cari Buku Lainnya</Btn>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────
// PAGE: LOANS
// ─────────────────────────────────────────
function LoansPage({ navigate, onSelectLoan }: { navigate: (p: Page) => void; onSelectLoan: (l: Loan) => void }) {
  const [tab, setTab] = useState<"aktif" | "dikembalikan" | "terlambat">("aktif");
  const [loansState, setLoansState] = useState<Loan[]>(() => loans.slice());
  const [extendTarget, setExtendTarget] = useState<number | null>(null);
  const [extendDate, setExtendDate] = useState<string>("");
  const [payTarget, setPayTarget] = useState<number | null>(null);
  const [paymentPending, setPaymentPending] = useState<number[]>([]);
  const [paymentForm, setPaymentForm] = useState<{ staff?: string; proofName?: string; note?: string }>({});
  const tabs = [
    { key: "aktif" as const, label: "Aktif", count: loansState.filter(l => l.status === "aktif").length },
    { key: "terlambat" as const, label: "Terlambat", count: loansState.filter(l => l.status === "terlambat").length },
    { key: "dikembalikan" as const, label: "Dikembalikan", count: loansState.filter(l => l.status === "dikembalikan").length },
  ];
  const filtered = loansState.filter(l => l.status === tab);

  return (
    <div className="min-h-screen bg-[#F4F7FF]">
      <TopNav navigate={navigate} currentPage="loans" unreadCount={2} />
      <motion.div {...pageMotion} className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Pinjaman Saya</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{loans.length} total pinjaman</p>
        </div>

        <div className="flex gap-1 mb-5 bg-white p-1 rounded-xl border border-border shadow-sm w-fit">
          {tabs.map(({ key, label, count }) => (
            <button key={key} onClick={() => setTab(key)}
              className={cn("flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                tab === key ? "bg-[#003087] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}>
              {label}
              <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-bold",
                tab === key ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              )}>{count}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map(loan => {
            const today = new Date("2026-06-29");
            const dueDate = new Date(loan.dueDate);
            const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / 86400000);
            return (
              <div key={loan.id} className="bg-white rounded-2xl border border-border shadow-sm p-4">
                <div className="flex items-start gap-4">
                  <img src={loan.bookCover} alt={loan.bookJudul} className="w-16 h-[88px] object-cover rounded-xl shadow-sm bg-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground line-clamp-2 leading-tight">{loan.bookJudul}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{loan.bookPenulis}</div>
                    <div className="mt-3 flex flex-col gap-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Dipinjam: {new Date(loan.borrowDate).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                      <div className={cn("flex items-center gap-1.5",
                        loan.status === "terlambat" ? "text-red-600 font-medium" :
                        loan.status === "dikembalikan" ? "text-green-600" :
                        daysLeft <= 3 ? "text-amber-600" : "text-foreground"
                      )}>
                        <Clock className="w-3.5 h-3.5" />
                        {loan.status === "dikembalikan"
                          ? `Dikembalikan: ${new Date(loan.returnDate!).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}`
                          : `Jatuh tempo: ${new Date(loan.dueDate).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}`
                        }
                        {loan.status === "aktif" && daysLeft > 0 && ` (${daysLeft} hari lagi)`}
                        {loan.status === "terlambat" && ` — ${Math.abs(daysLeft)} hari terlambat`}
                      </div>
                    </div>
                    {loan.status === "terlambat" && (
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="error">Terlambat</Badge>
                        <span className="text-xs text-red-600 font-semibold">Denda: Rp{((loan.fine ?? 0) * 1000).toLocaleString("id-ID")}</span>
                      </div>
                    )}
                  </div>
                </div>
                {loan.status !== "dikembalikan" && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
                    <Btn variant="outline" size="sm" onClick={() => { setExtendTarget(loan.id); setExtendDate(new Date(loan.dueDate).toISOString().slice(0,10)); }}>
                      <RefreshCw className="w-3.5 h-3.5" /> Perpanjang
                    </Btn>
                    <Btn onClick={() => { onSelectLoan(loan); navigate("return-form"); }} variant="secondary" size="sm">
                      <RotateCcw className="w-3.5 h-3.5" /> Kembalikan Buku
                    </Btn>
                    {loan.status === "terlambat" && (
                      paymentPending.includes(loan.id) ? (
                        <button className="px-3 py-2 rounded-lg bg-yellow-50 text-yellow-700 text-sm font-medium">Menunggu Verifikasi Admin</button>
                      ) : (
                        <Btn variant="danger" size="sm" onClick={() => { setPayTarget(loan.id); setPaymentForm({}); }}>
                          Bayar Denda (Rp{((loan.fine ?? 0) * 1000).toLocaleString("id-ID")})
                        </Btn>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">Tidak ada pinjaman {tab}</p>
            </div>
          )}
        </div>

        {/* Extend Dialog */}
        <Dialog open={extendTarget !== null} onOpenChange={(open) => { if (!open) setExtendTarget(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Perpanjang Masa Peminjaman</DialogTitle>
              <DialogDescription>Sesuaikan tanggal jatuh tempo untuk perpanjangan pinjaman.</DialogDescription>
            </DialogHeader>
            <div className="mt-2">
              <label className="text-sm text-muted-foreground block mb-2">Tanggal Jatuh Tempo Baru</label>
              <input type="date" className="w-full rounded-md border p-2" value={extendDate} onChange={e => setExtendDate(e.target.value)} />
            </div>
            <DialogFooter>
              <button className="px-4 py-2 rounded-lg bg-white border" onClick={() => setExtendTarget(null)}>Batal</button>
              <button className="px-4 py-2 rounded-lg bg-[#003087] text-white" onClick={() => {
                if (!extendTarget || !extendDate) return;
                setLoansState(prev => prev.map(l => l.id === extendTarget ? { ...l, dueDate: extendDate } : l));
                setExtendTarget(null);
                toast.success("Perpanjangan berhasil", { description: "Tanggal jatuh tempo telah diperbarui." });
              }}>Konfirmasi</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={payTarget !== null} onOpenChange={(open) => { if (!open) setPayTarget(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Pembayaran Denda</DialogTitle>
              <DialogDescription>Unggah bukti pembayaran dan isi data penerima.</DialogDescription>
            </DialogHeader>
            <div className="mt-2 space-y-3">
              <div>
                <label className="block text-sm mb-1 text-muted-foreground">Penerima</label>
                <input className="w-full rounded-md border p-2" value={paymentForm.staff ?? ""} onChange={e => setPaymentForm(f => ({ ...f, staff: e.target.value }))} placeholder="Nama petugas / rekening" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-muted-foreground">Unggah Bukti</label>
                <input type="file" accept="image/*,application/pdf" className="w-full" onChange={e => {
                  const file = e.target.files?.[0]; if (file) setPaymentForm(f => ({ ...f, proofName: file.name }));
                }} />
                {paymentForm.proofName && <div className="text-xs text-muted-foreground mt-1">{paymentForm.proofName}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1 text-muted-foreground">Catatan (opsional)</label>
                <textarea className="w-full rounded-md border p-2" rows={3} value={paymentForm.note ?? ""} onChange={e => setPaymentForm(f => ({ ...f, note: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <button className="px-4 py-2 rounded-lg bg-white border" onClick={() => setPayTarget(null)}>Batal</button>
              <button className="px-4 py-2 rounded-lg bg-[#003087] text-white" onClick={() => {
                if (!payTarget) return;
                setPaymentPending(prev => Array.from(new Set([...prev, payTarget])));
                setPayTarget(null);
                toast.success("Bukti pembayaran terkirim", { description: "Menunggu verifikasi admin." });
              }}>Kirim</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}

// Extend Dialog
function LoansDialogs({ loansState, setLoansState }: { loansState: Loan[]; setLoansState: (l: Loan[]) => void }) {
  const [extendTarget, setExtendTarget] = useState<number | null>(null);
  const [extendDate, setExtendDate] = useState<string>("");
  const [payTarget, setPayTarget] = useState<number | null>(null);
  const [paymentPending, setPaymentPending] = useState<number[]>([]);
  const [paymentForm, setPaymentForm] = useState<{ staff?: string; proofName?: string; note?: string }>({});

  // Expose setters via window for simplicity (not ideal but minimal changes)
  // Instead, we'll manage dialogs inside LoansPage; this placeholder kept for compatibility.
  return null;
}

// notifications page removed

// ─────────────────────────────────────────
// PAGE: PROFILE
// ─────────────────────────────────────────
function ProfilePage({ navigate }: { navigate: (p: Page) => void }) {
  const [aktifTab, setAktifTab] = useState<"ringkasan" | "pengaturan" | "bantuan">("ringkasan");

  return (
    <div className="min-h-screen bg-[#F4F7FF]">
      <TopNav navigate={navigate} currentPage="profile" unreadCount={2} />
      <motion.div {...pageMotion} className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-gradient-to-br from-[#003087] to-[#1565C0] rounded-3xl p-6 mb-6 text-white">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg text-2xl font-bold shrink-0">
              AF
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold">Ahmad Firdaus</h1>
              <p className="text-white/80 text-sm">A22EC0001 · Tahun 4</p>
              <p className="text-white/70 text-sm">Teknik Informatika</p>
              <div className="mt-2">
                <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full">UIN Syarif Hidayatullah Jakarta</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[{ label: "Pinjaman Aktif", value: String(loans.filter(l => l.status === "aktif").length) }, { label: "Total Dipinjam", value: String(loans.length) }, { label: "Bergabung Sejak", value: "2022" }].map(({ label, value }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <div className="text-xl font-bold">{value}</div>
                <div className="text-white/70 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-1 mb-5 bg-white p-1 rounded-xl border border-border shadow-sm w-fit">
          {(["ringkasan", "pengaturan", "bantuan"] as const).map(t => (
            <button key={t} onClick={() => setAktifTab(t)}
              className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                aktifTab === t ? "bg-[#003087] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}>
              {t}
            </button>
          ))}
        </div>

        {aktifTab === "ringkasan" && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
              <h3 className="font-bold text-foreground mb-4">Informasi Mahasiswa</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Nama Lengkap", value: "Ahmad Firdaus" },
                  { label: "NIM", value: "A22EC0001" },
                  { label: "Email", value: "ahmad.firdaus@mhs.uinjkt.ac.id" },
                  { label: "Jurusan", value: "Teknik Informatika" },
                  { label: "Fakultas", value: "UIN Syarif Hidayatullah Jakarta" },
                  { label: "Bergabung Sejak", value: "September 2022" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#F4F7FF] rounded-xl p-3">
                    <div className="text-xs text-muted-foreground font-medium mb-0.5">{label}</div>
                    <div className="text-sm font-semibold text-foreground">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
              <h3 className="font-bold text-foreground mb-4">Aktivitas Terkini</h3>
              <div className="flex flex-col divide-y divide-border">
                {loans.slice(0, 3).map(loan => (
                  <div key={loan.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <img src={loan.bookCover} alt={loan.bookJudul} className="w-10 h-14 object-cover rounded-lg bg-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground line-clamp-1">{loan.bookJudul}</div>
                      <div className="text-xs text-muted-foreground">{loan.borrowDate}</div>
                    </div>
                    <Badge variant={loan.status === "dikembalikan" ? "success" : loan.status === "terlambat" ? "error" : "default"}>{loan.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {aktifTab === "pengaturan" && (
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5 flex flex-col gap-4">
            <h3 className="font-bold text-foreground">Pengaturan Akun</h3>
            {[
              { label: "Email Notifikasi", desc: "Terima pengingat jatuh tempo via email", defaultOn: true },
              { label: "SMS Notifikasi", desc: "Terima peringatan SMS untuk buku terlambat", defaultOn: false },
              { label: "Koleksi Terbaru Updates", desc: "Beri tahu saya ketika buku baru ditambahkan", defaultOn: true },
              { label: "Newsletter Bulanan", desc: "Terima newsletter perpustakaan bulanan", defaultOn: false },
            ].map(({ label, desc, defaultOn }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-[#F4F7FF] rounded-xl">
                <div className="min-w-0 mr-4">
                  <div className="text-sm font-medium text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
                <ToggleSwitch defaultOn={defaultOn} />
              </div>
            ))}
            <div className="border-t border-border pt-4">
              <Btn variant="danger" size="md" onClick={() => navigate("landing")}>
                <LogOut className="w-4 h-4" /> Keluar
              </Btn>
            </div>
          </div>
        )}

        {aktifTab === "bantuan" && (
          <div className="flex flex-col gap-3">
            <FaqItem question="Bagaimana cara meminjam buku?" answer="Jelajahi katalog, klik buku, dan tekan tombol Pinjam. Anda dapat meminjam hingga 5 buku sekaligus. Periode peminjaman dimulai segera." />
            <FaqItem question="Berapa lama durasi peminjaman?" answer="Standard loan period is 30 days. You can extend your loan once via the Pinjaman Saya page, provided the book is not reserved by another member." />
            <FaqItem question="Bagaimana denda dihitung?" answer="Fines are Rp2.000 per hari untuk buku yang terlambat dikembalikan. Denda dapat dibayar di meja perpustakaan atau melalui aplikasi ini." />
            <FaqItem question="Bagaimana cara mereservasi buku yang tidak tersedia?" answer="Klik tombol Reservasi pada buku yang tidak tersedia. Anda akan diberitahu melalui email dan notifikasi aplikasi ketika buku tersedia. Anda memiliki 3 hari untuk mengambilnya." />
            <FaqItem question="Bisakah saya mengakses e-book?" answer="Ya, UIN Jakarta menyediakan akses ke berbagai platform e-book termasuk SpringerLink, Elsevier, dan IEEE Xplore. Masuk dengan akun UIN Jakarta Anda untuk mengakses sumber daya ini." />
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────
// ADMIN: DASHBOARD
// ─────────────────────────────────────────
function AdminDashboardPage({ navigate }: { navigate: (p: Page) => void }) {
  const statCards = [
    { label: "Total Buku", value: "12,840", change: "+128", icon: BookOpen, color: "bg-[#003087]/10 text-[#003087]" },
    { label: "Pinjaman Aktif", value: "847", change: "+23", icon: BookMarked, color: "bg-blue-100 text-blue-600" },
    { label: "Anggota", value: "3,210", change: "+14", icon: Users, color: "bg-purple-100 text-purple-600" },
    { label: "Dikembalikan Hari Ini", value: "34", change: "+8", icon: RotateCcw, color: "bg-green-100 text-green-600" },
    { label: "Terlambat Bukus", value: "42", change: "-5", icon: AlertTriangle, color: "bg-amber-100 text-amber-600" },
    { label: "Denda Terkumpul", value: "Rp1.240.000", change: "+Rp180.000", icon: DollarSign, color: "bg-rose-100 text-rose-600" },
  ];

  return (
    <AdminLayout navigate={navigate} currentPage="admin-dashboard" title="Dasbor" subtitle="Ringkasan dan analitik perpustakaan">
      <motion.div {...pageMotion} className="flex flex-col gap-5">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map(({ label, value, change, icon: Icon, color }) => {
            const isMemberCard = label === "Anggota";
            const cardClasses = cn(
              "rounded-2xl p-4 border border-border shadow-sm transition-shadow",
              isMemberCard ? "bg-[#E8F2FF] hover:bg-[#dbe7ff] cursor-pointer" : "bg-white hover:shadow-md"
            );

            return isMemberCard ? (
              <button key={label} onClick={() => navigate("admin-members")} className={cardClasses}>
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xl font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground font-medium">{label}</div>
                <div className={cn("text-xs font-semibold mt-1", change.startsWith("+") ? "text-green-600" : "text-red-500")}>
                  {change} bulan ini
                </div>
                <div className="mt-3 text-xs font-medium text-[#003087]">Klik untuk kelola anggota</div>
              </button>
            ) : (
              <div key={label} className={cardClasses}>
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xl font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground font-medium">{label}</div>
                <div className={cn("text-xs font-semibold mt-1", change.startsWith("+") ? "text-green-600" : "text-red-500")}>
                  {change} bulan ini
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-foreground">Tindakan Cepat</h3>
              <p className="text-xs text-muted-foreground">Akses cepat ke pengelolaan buku, anggota, dan pinjaman.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button onClick={() => navigate("admin-books")} className="rounded-2xl border border-border bg-[#F4F7FF] p-4 text-left hover:border-[#003087] hover:bg-white transition-colors">
              <div className="text-xs text-muted-foreground">Buku</div>
              <div className="mt-2 font-semibold text-foreground">Kelola Koleksi</div>
            </button>
            <button onClick={() => navigate("admin-members")} className="rounded-2xl border border-border bg-[#F4F7FF] p-4 text-left hover:border-[#003087] hover:bg-white transition-colors">
              <div className="text-xs text-muted-foreground">Anggota</div>
              <div className="mt-2 font-semibold text-foreground">Kelola Anggota</div>
            </button>
            <button onClick={() => navigate("admin-loans")} className="rounded-2xl border border-border bg-[#F4F7FF] p-4 text-left hover:border-[#003087] hover:bg-white transition-colors">
              <div className="text-xs text-muted-foreground">Pinjaman</div>
              <div className="mt-2 font-semibold text-foreground">Kelola Pinjaman</div>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-foreground">Aktivitas Bulanan</h3>
                <p className="text-xs text-muted-foreground">Pinjam vs Kembali · Jan–Jun 2026</p>
              </div>
              <select className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-white text-muted-foreground focus:outline-none">
                <option>6 bulan terakhir</option><option>Tahun lalu</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, tersisa: -25 }}>
                <defs>
                  <linearGradient id="borrowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop darifset="0%" stopColor="#003087" stopOpacity={0.3} />
                    <stop darifset="100%" stopColor="#003087" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="returnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop darifset="0%" stopColor="#1565C0" stopOpacity={0.3} />
                    <stop darifset="100%" stopColor="#1565C0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: "1px solid #E5E7EB" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="borrows" stroke="#003087" strokeWidth={2} fill="url(#borrowGrad)" name="Jumlah Pinjam" />
                <Area type="monotone" dataKey="returns" stroke="#1565C0" strokeWidth={2} fill="url(#returnGrad)" name="Jumlah Kembali" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <div className="mb-4">
              <h3 className="font-bold text-foreground">Pinjaman per Kategori</h3>
              <p className="text-xs text-muted-foreground">Distribusi pinjaman aktif</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                  {categoryData.map((entry, index) => <Cell key={`pie-cell-${entry.name}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 mt-2">
              {categoryData.slice(0, 4).map(({ name, value, color }) => (
                <div key={name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-muted-foreground flex-1 truncate">{name}</span>
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">Buku Paling Banyak Dipinjam</h3>
              <button onClick={() => navigate("admin-books")} className="text-xs text-[#003087] font-medium hover:underline">Lihat semua</button>
            </div>
            <div className="flex flex-col gap-3">
              {topBukus.map(({ title, borrows, author }, i) => (
                <div key={title} className="flex items-center gap-3">
                  <span className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                    i === 0 ? "bg-amber-400 text-white" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-amber-700/80 text-white" : "bg-gray-100 text-gray-500"
                  )}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{title}</div>
                    <div className="text-xs text-muted-foreground">{author}</div>
                  </div>
                  <div className="text-sm font-bold text-[#003087] shrink-0">{borrows}×</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">Aktivitas Terkini</h3>
              <button className="text-xs text-[#003087] font-medium hover:underline">Lihat log</button>
            </div>
            <div className="flex flex-col gap-3">
              {recentActivity.map(({ action, detail, time, type }) => {
                const iconMap2: Record<string, { icon: React.ElementType; color: string }> = {
                  borrow: { icon: BookOpen, color: "bg-blue-100 text-blue-600" },
                  return: { icon: RotateCcw, color: "bg-green-100 text-green-600" },
                  member: { icon: Users, color: "bg-purple-100 text-purple-600" },
                  fine: { icon: DollarSign, color: "bg-amber-100 text-amber-600" },
                  reserve: { icon: BookMarked, color: "bg-[#003087]/10 text-[#003087]" },
                };
                const { icon: Icon, color } = iconMap2[type] || iconMap2.borrow;
                return (
                  <div key={detail} className="flex items-start gap-3">
                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", color)}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-foreground">{action}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{detail}</div>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}

// ─────────────────────────────────────────
// ADMIN: BOOKS
// ─────────────────────────────────────────
function AdminBooksPage({ navigate }: { navigate: (p: Page) => void }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editBuku, setEditBook] = useState<Book | null>(null);
  const [form, setForm] = useState({ title: "", author: "", isbn: "", publisher: "", category: "Teknik Informatika", year: "2024", description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const allBooks = [...books, ...islamicBooks];
  const [booksState, setBooksState] = useState<Book[]>(() => allBooks.slice());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const filtered = booksState.filter(b => !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()) || b.isbn.includes(search));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const openAdd = () => { setEditBook(null); setForm({ title: "", author: "", isbn: "", publisher: "", category: "Teknik Informatika", year: "2024", description: "" }); setShowModal(true); };
  const openEdit = (b: Book) => { setEditBook(b); setForm({ title: b.title, author: b.author, isbn: b.isbn, publisher: b.publisher, category: b.category, year: String(b.year), description: b.description }); setShowModal(true); };

  return (
    <AdminLayout navigate={navigate} currentPage="admin-books" title="Kelola Buku" subtitle={`${books.length} buku dalam sistem`}>
      <motion.div {...pageMotion}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari buku..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30" />
          </div>
          <div className="flex items-center gap-2">
            <Btn onClick={openAdd}><Plus className="w-4 h-4" /> Tambah Buku</Btn>
            <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-white text-sm text-muted-foreground hover:text-[#003087] hover:border-[#003087]/50 transition-colors">
              <Download className="w-4 h-4" /> Ekspor
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-[#F4F7FF]">
                  {["Buku", "Kategori", "ISBN", "Ketersediaan", "Penilaian", "Aksi"].map(h => (
                    <th key={h} className={cn("text-tersisa text-xs font-bold text-muted-foreground uppercase tracking-wide px-4 py-3",
                      h === "ISBN" && "hidden md:table-cell",
                      h === "Kategori" && "hidden sm:table-cell",
                      h === "Penilaian" && "hidden lg:table-cell",
                      h === "Ketersediaan" && "text-center",
                      h === "Aksi" && "text-right"
                    )}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map(book => (
                  <tr key={book.id} className="hover:bg-[#F4F7FF]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded-lg bg-gray-100 shadow-sm shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-foreground line-clamp-1">{book.title}</div>
                          <div className="text-xs text-muted-foreground">{book.author}</div>
                          <div className="text-xs text-muted-foreground">{book.year} · {book.edition}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell"><Badge variant="default">{book.category}</Badge></td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs font-mono text-muted-foreground">{book.isbn}</span>
                    </td>
                    <td className="px-4 py-3 text-center"><KetersediaanBadge available={book.available} total={book.total} /></td>
                    <td className="px-4 py-3 hidden lg:table-cell text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-foreground">{book.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(book)} className="p-1.5 rounded-lg hover:bg-[#003087]/10 text-muted-foreground hover:text-[#003087] transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteTarget(book.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Menampilkan {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} dari {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-[#003087]/10 text-muted-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={cn("w-8 h-8 rounded-lg text-xs font-semibold transition-colors",
                    currentPage === p ? "bg-[#003087] text-white" : "hover:bg-[#003087]/10 text-muted-foreground"
                  )}>
                  {p}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-[#003087]/10 text-muted-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete confirmation dialog for admin books */}
      <Dialog open={deleteTarget != null} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Buku</DialogTitle>
            <DialogDescription>
              <p>Apakah Anda yakin ingin menghapus buku ini?</p>
              <p>Data yang dihapus tidak dapat dikembalikan.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button className="px-4 py-2 rounded-lg border" onClick={() => setDeleteTarget(null)}>Batal</button>
            <button className="px-4 py-2 rounded-lg bg-red-600 text-white" onClick={() => {
              if (!deleteTarget) return;
              const book = booksState.find(b => b.id === deleteTarget);
              setBooksState(s => s.filter(b => b.id !== deleteTarget));
              setDeleteTarget(null);
              toast.success("Buku berhasil dihapus.", { description: book?.title });
            }}>Hapus</button>
          </DialogFooter>
          <DialogClose />
        </DialogContent>
      </Dialog>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground">{editBuku ? "Edit Buku" : "Add New Buku"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-[#F4F7FF] text-muted-foreground transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-col gap-4">
              <InputField label="Buku Judul" placeholder="cth. Pengantar Algoritma" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
              <InputField label="Penulis" placeholder="cth. Thomas H. Cormen" value={form.author} onChange={v => setForm(f => ({ ...f, author: v }))} />
              <div className="grid grid-cols-2 gap-3">
                <InputField label="ISBN" placeholder="978-0-000-00000-0" value={form.isbn} onChange={v => setForm(f => ({ ...f, isbn: v }))} />
                <InputField label="Tahun Terbit" placeholder="2024" value={form.year} onChange={v => setForm(f => ({ ...f, year: v }))} />
              </div>
              <InputField label="Penerbit" placeholder="cth. MIT Press" value={form.publisher} onChange={v => setForm(f => ({ ...f, publisher: v }))} />
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Kategori</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087]">
                  {categories.filter(c => c !== "Semua").map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Deskripsi</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Deskripsi singkat buku..." rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30 focus:border-[#003087] resize-none" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Gambar Sampul</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-[#003087]/50 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Klik untuk unggah atau seret & lepas</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG hingga 5MB</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-border">
              <Btn onClick={() => setShowModal(false)} variant="outline" size="md" className="flex-1">Batal</Btn>
              <Btn onClick={() => setShowModal(false)} size="md" className="flex-1">
                <Save className="w-4 h-4" /> {editBuku ? "Update Buku" : "Tambah Buku"}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ─────────────────────────────────────────
// ADMIN: MEMBERS
// ─────────────────────────────────────────
function AdminMembersPage({ navigate }: { navigate: (p: Page) => void }) {
  const [search, setSearch] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberForm, setMemberForm] = useState({ name: "", studentId: "", angkatan: "", programStudi: "", email: "", phone: "", status: "active" });
  const [membersState, setMembersState] = useState(() => members.slice());
  const [extendTarget, setExtendTarget] = useState<string | null>(null);
  const [deleteMemberTarget, setDeleteMemberTarget] = useState<string | null>(null);
  const [newExpiry, setNewExpiry] = useState<string | null>(null);

  const filtered = membersState.filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.studentId.toLowerCase().includes(search.toLowerCase()));

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddMember(false);
    window.alert("Anggota berhasil ditambahkan (demo)");
  };

  return (
    <AdminLayout navigate={navigate} currentPage="admin-members" title="Anggota" subtitle={`${members.length} anggota terdaftar`}>
      <motion.div {...pageMotion}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari anggota..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#003087]/30" />
          </div>
          <Btn onClick={() => setShowAddMember(true)}><Plus className="w-4 h-4" /> Tambah Anggota</Btn>
        </div>
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-[#F4F7FF]">
                  <th className="text-tersisa text-xs font-bold text-muted-foreground uppercase tracking-wide px-4 py-3">Anggota</th>
                  <th className="text-tersisa text-xs font-bold text-muted-foreground uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Jurusan</th>
                  <th className="text-center text-xs font-bold text-muted-foreground uppercase tracking-wide px-4 py-3 hidden md:table-cell">Pinjaman Aktif</th>
                  <th className="text-center text-xs font-bold text-muted-foreground uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Total</th>
                  <th className="text-center text-xs font-bold text-muted-foreground uppercase tracking-wide px-4 py-3">Status</th>
                  <th className="text-right text-xs font-bold text-muted-foreground uppercase tracking-wide px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(member => (
                  <tr key={member.id} className="hover:bg-[#F4F7FF]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#003087]/10 rounded-xl flex items-center justify-center text-xs font-bold text-[#003087] shrink-0">
                          {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-sm text-muted-foreground">{member.department}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-center text-sm font-semibold text-foreground">{member.activeLoans}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-center text-sm text-muted-foreground">{member.totalLoans}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={member.status === "aktif" ? "success" : "error"}>{member.status === "active" ? "Aktif" : "Ditangguhkan"}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setExtendTarget(member.id); setNewExpiry(member.membershipExpiry ?? ""); }} className="px-3 py-1.5 bg-[#003087]/10 text-[#003087] rounded-lg text-sm font-medium">Perpanjang</button>
                        <button onClick={() => setDeleteMemberTarget(member.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium">Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showAddMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddMember(false)} />
            <form onSubmit={handleAddMember} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Tambah Anggota</h3>
                <button type="button" onClick={() => setShowAddMember(false)} className="p-2 rounded-xl hover:bg-[#F4F7FF] text-muted-foreground transition-colors">×</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm mb-2 block">Nama</label>
                  <input required value={memberForm.name} onChange={e => setMemberForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-border" />
                </div>
                <div>
                  <label className="text-sm mb-2 block">NIM</label>
                  <input required value={memberForm.studentId} onChange={e => setMemberForm(f => ({ ...f, studentId: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-border" />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Angkatan</label>
                  <input value={memberForm.angkatan} onChange={e => setMemberForm(f => ({ ...f, angkatan: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-border" />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Program Studi</label>
                  <input value={memberForm.programStudi} onChange={e => setMemberForm(f => ({ ...f, programStudi: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-border" />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Email</label>
                  <input type="email" value={memberForm.email} onChange={e => setMemberForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-border" />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Nomor HP</label>
                  <input value={memberForm.phone} onChange={e => setMemberForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-border" />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setShowAddMember(false)} className="flex-1 py-3 bg-card border border-border rounded-2xl">Batal</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-2xl">Simpan</button>
              </div>
            </form>
          </div>
        )}
        {extendTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setExtendTarget(null)} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Perpanjang Masa Keanggotaan</h3>
                <button onClick={() => setExtendTarget(null)} className="p-2 rounded-xl hover:bg-[#F4F7FF] text-muted-foreground transition-colors">×</button>
              </div>
              {(() => {
                const target = membersState.find(m => m.id === extendTarget);
                return (
                  <form onSubmit={(e) => { e.preventDefault(); if (!target) return; setMembersState(s => s.map(m => m.id === target.id ? { ...m, membershipExpiry: newExpiry ?? m.membershipExpiry } : m)); setExtendTarget(null); }}>
                    <div className="mb-3">
                      <div className="text-sm font-medium">Nama anggota</div>
                      <div className="text-sm text-muted-foreground">{target?.name}</div>
                    </div>
                    <div className="mb-3">
                      <div className="text-sm font-medium">Masa berlaku saat ini</div>
                      <div className="text-sm text-muted-foreground">{target?.membershipExpiry ?? "-"}</div>
                    </div>
                    <div className="mb-4">
                      <label className="text-sm mb-1 block">Pilih tanggal berakhir</label>
                      <input type="date" value={newExpiry ?? ""} onChange={e => setNewExpiry(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border" />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button type="button" onClick={() => setExtendTarget(null)} className="px-4 py-2 rounded-xl border border-border">Batal</button>
                      <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white">Perpanjang</button>
                    </div>
                  </form>
                );
              })()}
            </div>
          </div>
        )}

        {deleteMemberTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteMemberTarget(null)} />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Konfirmasi Hapus Anggota</h3>
                <button onClick={() => setDeleteMemberTarget(null)} className="p-2 rounded-xl hover:bg-[#F4F7FF] text-muted-foreground transition-colors">×</button>
              </div>
              {(() => {
                const target = membersState.find(m => m.id === deleteMemberTarget);
                return (
                  <div>
                    <p className="mb-4">Apakah Anda yakin ingin menghapus anggota <strong>{target?.name}</strong>?</p>
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setDeleteMemberTarget(null)} className="px-4 py-2 rounded-xl border border-border">Batal</button>
                      <button onClick={() => { if (target) setMembersState(s => s.filter(x => x.id !== target.id)); setDeleteMemberTarget(null); }} className="px-4 py-2 rounded-xl bg-red-600 text-white">Hapus</button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
}

// ─────────────────────────────────────────
// ADMIN: LOANS
// ─────────────────────────────────────────
function AdminLoansPage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <AdminLayout navigate={navigate} currentPage="admin-loans" title="Permintaan Pinjam" subtitle="Kelola semua permintaan pinjam aktif">
      <motion.div {...pageMotion}>
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-[#F4F7FF]">
                  {["ID Pinjaman", "Anggota", "Buku", "Tanggal Pinjam", "Tanggal Kembali", "Status", ""].map(h => (
                    <th key={h} className="text-tersisa text-xs font-bold text-muted-foreground uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loans.map(loan => (
                  <tr key={loan.id} className="hover:bg-[#F4F7FF]/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{loan.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#003087]/10 rounded-lg flex items-center justify-center text-[10px] font-bold text-[#003087] shrink-0">AF</div>
                        <span className="text-sm font-medium text-foreground">Ahmad Firdaus</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={loan.bookCover} alt={loan.bookJudul} className="w-8 h-11 object-cover rounded-lg bg-gray-100 shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-foreground line-clamp-1 max-w-[200px]">{loan.bookJudul}</div>
                          <div className="text-xs text-muted-foreground">{loan.bookPenulis}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{loan.borrowDate}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{loan.dueDate}</td>
                    <td className="px-4 py-3">
                      <Badge variant={loan.status === "aktif" ? "info" : loan.status === "dikembalikan" ? "success" : "error"}>{loan.status === "aktif" ? "Aktif" : loan.status === "dikembalikan" ? "Dikembalikan" : "Terlambat"}</Badge>
                    </td>
                    <td className="px-4 py-3">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}

// ─────────────────────────────────────────
// ADMIN: REPORTS
// ─────────────────────────────────────────
function AdminReportsPage({ navigate }: { navigate: (p: Page) => void }) {
  const fineData = [
    { month: "Jan", collected: 480, outstanding: 120 },
    { month: "Feb", collected: 360, outstanding: 95 },
    { month: "Mar", collected: 560, outstanding: 140 },
    { month: "Apr", collected: 420, outstanding: 80 },
    { month: "May", collected: 640, outstanding: 160 },
    { month: "Jun", collected: 510, outstanding: 110 },
  ];

  return (
    <AdminLayout navigate={navigate} currentPage="admin-reports" title="Laporan & Analitik" subtitle="Statistik kinerja perpustakaan">
      <motion.div {...pageMotion} className="flex flex-col gap-5">
        <div className="flex items-center justify-end gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-muted-foreground hover:text-[#003087] hover:border-[#003087]/50 transition-colors">
            <Download className="w-4 h-4" /> Ekspor PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-muted-foreground hover:text-[#003087] hover:border-[#003087]/50 transition-colors">
            <Download className="w-4 h-4" /> Ekspor Excel
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <h3 className="font-bold text-foreground mb-1">Statistik Pinjam Bulanan</h3>
            <p className="text-xs text-muted-foreground mb-4">Januari – Juni 2026</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, tersisa: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: "1px solid #E5E7EB" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="borrows" name="Pinjaman Bulanan" fill="#003087" radius={[4, 4, 0, 0]} />
                <Bar dataKey="returns" name="Pengembalian Bulanan" fill="#90CAF9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <h3 className="font-bold text-foreground mb-1">Pengumpulan Denda</h3>
            <p className="text-xs text-muted-foreground mb-4">Terkumpul vs Belum Dibayar · Rp</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={fineData} margin={{ top: 5, right: 5, bottom: 0, tersisa: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: "1px solid #E5E7EB" }} formatter={(v: number) => [`Rp${(v * 1000).toLocaleString("id-ID")}`, ""]} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="collected" name="Terkumpul" fill="#1565C0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outstanding" name="Belum Dibayar" fill="#FFC107" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <h3 className="font-bold text-foreground mb-1">Pendaftaran Anggota Baru</h3>
            <p className="text-xs text-muted-foreground mb-4">Pendaftaran bulanan · 2026</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, tersisa: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: "1px solid #E5E7EB" }} />
                <Line type="monotone" dataKey="newMembers" name="Anggota Baru" stroke="#003087" strokeWidth={2.5} dot={{ fill: "#003087", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <h3 className="font-bold text-foreground mb-1">Popular Bukus Report</h3>
            <p className="text-xs text-muted-foreground mb-4">Buku paling banyak dipinjam semester ini</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-tersisa text-xs font-bold text-muted-foreground uppercase pb-2">#</th>
                    <th className="text-tersisa text-xs font-bold text-muted-foreground uppercase pb-2">Judul</th>
                    <th className="text-right text-xs font-bold text-muted-foreground uppercase pb-2">Pinjam</th>
                    <th className="text-right text-xs font-bold text-muted-foreground uppercase pb-2">Persentase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topBukus.map(({ title, borrows, author }, i) => (
                    <tr key={title}>
                      <td className="py-2.5 text-xs font-bold text-muted-foreground">{i + 1}</td>
                      <td className="py-2.5 pr-3">
                        <div className="text-sm font-medium text-foreground line-clamp-1">{title}</div>
                        <div className="text-xs text-muted-foreground">{author}</div>
                      </td>
                      <td className="py-2.5 text-right text-sm font-bold text-foreground">{borrows}</td>
                      <td className="py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#003087] rounded-full" style={{ width: `${(borrows / 50) * 100}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{Math.round((borrows / 50) * 100)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}

// ─────────────────────────────────────────
// ADMIN: SETTINGS
// ─────────────────────────────────────────
function AdminSettingsPage({ navigate }: { navigate: (p: Page) => void }) {
  const [libName, setLibName] = useState("Perpustakaan UIN Jakarta");
  const [institution, setInstitusi] = useState("UIN Syarif Hidayatullah Jakarta");
  const [location, setLokasi] = useState("Jl. Ir. H. Juanda No.95, Ciputat, Tangerang Selatan");
  const [email, setEmail] = useState("perpustakaan@uinjkt.ac.id");
  const [loanPeriod, setLoanPeriod] = useState("30");
  const [maxLoans, setMaxLoans] = useState("5");
  const [finePerDay, setFinePerDay] = useState("2000");
  const [renewalLimit, setRenewalLimit] = useState("1");

  return (
    <AdminLayout navigate={navigate} currentPage="admin-settings" title="Pengaturan" subtitle="Konfigurasi dan preferensi sistem">
      <motion.div {...pageMotion} className="max-w-2xl flex flex-col gap-5">
        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-bold text-foreground mb-4">Informasi Perpustakaan</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <InputField label="Nama Perpustakaan" value={libName} onChange={setLibName} />
            <InputField label="Institusi" value={institution} onChange={setInstitusi} />
            <InputField label="Lokasi" value={location} onChange={setLokasi} />
            <InputField label="Email Kontak" type="email" value={email} onChange={setEmail} />
          </div>
          <div className="mt-4 pt-3 border-t border-border flex justify-end">
            <Btn size="sm"><Save className="w-3.5 h-3.5" /> Simpan Perubahan</Btn>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-bold text-foreground mb-4">Kebijakan Pinjaman</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <InputField label="Periode Pinjam Default (hari)" value={loanPeriod} onChange={setLoanPeriod} />
            <InputField label="Maks. Pinjaman Aktif per Anggota" value={maxLoans} onChange={setMaxLoans} />
            <InputField label="Denda per Hari (Rp)" value={finePerDay} onChange={setFinePerDay} />
            <InputField label="Batas Perpanjangan per Pinjaman" value={renewalLimit} onChange={setRenewalLimit} />
          </div>
          <div className="mt-4 pt-3 border-t border-border flex justify-end">
            <Btn size="sm"><Save className="w-3.5 h-3.5" /> Simpan Perubahan</Btn>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-bold text-foreground mb-4">Pengaturan Notifikasi</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: "Tanggal Kembali Reminders", desc: "Kirim pengingat email 3 hari sebelum jatuh tempo", defaultOn: true },
              { label: "Terlambat Alerts", desc: "Beri tahu anggota segera saat buku melewati jatuh tempo", defaultOn: true },
              { label: "Fine Notifikasi", desc: "Kirim pemberitahuan akumulasi denda setiap hari", defaultOn: false },
              { label: "Siaran Koleksi Terbaru", desc: "Beri tahu anggota tentang buku baru setiap minggu", defaultOn: true },
            ].map(({ label, desc, defaultOn }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-[#F4F7FF] rounded-xl">
                <div className="min-w-0 mr-4">
                  <div className="text-sm font-medium text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
                <ToggleSwitch defaultOn={defaultOn} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-bold text-foreground mb-2">Zona Berbahaya</h3>
          <p className="text-sm text-muted-foreground mb-4">Tindakan tidak dapat dibatalkan yang mempengaruhi semua data sistem.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Btn variant="danger" size="sm">Hapus Semua Catatan Keterlambatan</Btn>
            <Btn variant="danger" size="sm">Reset Saldo Denda</Btn>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}

// ─────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [selectedBook, setSelectedBook] = useState<Book>(books[0]);
  const [selectedLoan, setSelectedLoan] = useState<Loan>(loans[0]);

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  switch (page) {
    case "landing":        return <LandingPage navigate={navigate} />;
    case "login":          return <LoginPage navigate={navigate} />;
    case "dashboard":      return <DashboardPage navigate={navigate} onSelectBook={b => { setSelectedBook(b); }} />;
    case "catalog":        return <CatalogPage navigate={navigate} onSelectBook={b => { setSelectedBook(b); }} />;
    case "book-detail":    return <BookDetailPage navigate={navigate} book={selectedBook} onBorrow={() => navigate("borrow-form")} />;
    case "ebook":          return <EbookPage navigate={navigate} book={selectedBook} />;
    case "borrow-form":    return <BorrowFormPage navigate={navigate} book={selectedBook} />;
    case "borrow-success": return <BorrowSuccessPage navigate={navigate} book={selectedBook} />;
    case "return-form":    return <ReturnFormPage navigate={navigate} loan={selectedLoan} />;
    case "loans":          return <LoansPage navigate={navigate} onSelectLoan={l => { setSelectedLoan(l); }} />;
    // notifications page removed
    case "profile":        return <ProfilePage navigate={navigate} />;
    case "admin-dashboard": return <AdminDashboardPage navigate={navigate} />;
    case "admin-books":    return <AdminBooksPage navigate={navigate} />;
    case "admin-members":  return <AdminMembersPage navigate={navigate} />;
    case "admin-loans":    return <AdminLoansPage navigate={navigate} />;
    case "admin-reports":  return <AdminReportsPage navigate={navigate} />;
    case "admin-settings": return <AdminSettingsPage navigate={navigate} />;
    default:               return <LandingPage navigate={navigate} />;
  }
}
