# FST Library Application Documentation

## Overview
A modern, mobile-first library management application for the Faculty of Science and Technology. Built with React, TypeScript, Tailwind CSS, and React Router.

## Design Specifications
- **Mobile Size**: 390×844 px (optimized for mobile devices)
- **Primary Color**: #2E7D32 (Green)
- **Secondary Color**: #81C784 (Light Green)
- **Background**: #F8F9FA
- **Typography**: Inter font family
- **Rounded Corners**: 16px (1rem)
- **Spacing Grid**: 8px based

## User Screens

### 1. Splash Screen (`/`)
- Animated library logo with BookOpen icon
- App name: "FST Library"
- Auto-redirects to login after 2.5 seconds
- Gradient background from primary to secondary

### 2. Login Screen (`/login`)
- Email and password fields
- Show/hide password toggle
- Remember Me checkbox
- Forgot Password link
- University Account sign-in option
- Auto-navigates to home on login

### 3. Home Dashboard (`/home`)
- Personalized greeting
- Search bar (navigates to search screen)
- Promotional banner
- 5 Category chips: Science, Technology, Mathematics, Engineering, Computer Science
- Featured Books section (rating ≥ 4.8)
- Popular Books list
- Recently Added books (2024 publications)
- Bottom navigation

### 4. Search Screen (`/search`)
- Real-time search bar
- Filter toggle button
- Category filter dropdown
- Availability filters (Available/Borrowed)
- Grid view of filtered results
- Empty state when no books found

### 5. Book Detail Screen (`/book/:id`)
- Large book cover image
- Book title and author
- Rating with star icon
- Available copies count
- Publisher, Year, Category, ISBN
- Full description
- Action buttons: Borrow Book, Reserve Book, Add to Favorites
- Related books section (same category)

### 6. Borrow Confirmation (`/borrow-confirmation/:id`)
- Book summary with cover
- Borrow date (current date)
- Due date (30 days from borrow)
- Important notes about borrowing
- Confirm/Cancel buttons
- Success animation with checkmark
- Auto-redirects to loans after success

### 7. Loans Screen (`/loans`)
- Tabbed interface: Active, Returned, Overdue
- Loan cards showing:
  - Book cover thumbnail
  - Borrow and due dates
  - Status badges
  - Extend loan button (for active loans)
- Toast notification on extend
- Empty states for each tab

### 8. Notifications Screen (`/notifications`)
- Unread count in header
- Notification cards with icons:
  - Due date reminders (Calendar)
  - Reservation updates (BookOpen)
  - Borrow confirmations (CheckCircle)
  - New arrivals (Sparkles)
- Visual indicators for unread (left border)
- Time stamps

### 9. Profile Screen (`/profile`)
- User avatar and information
- Student ID and faculty
- Statistics: Books Read, Active Loans, Favorites
- Menu items:
  - Edit Profile
  - Loan History
  - Settings
  - Help Center
- Logout button
- App version

## Admin Screens

### Admin Dashboard (`/admin`)
- Collapsible sidebar navigation
- 4 Statistics cards:
  - Total Books
  - Active Loans
  - Returned Today
  - Registered Members
- Quick action buttons
- Recent activity table

### Manage Books (`/admin/books`)
- Search and filter bar
- Books table with columns:
  - Title (with thumbnail)
  - Author
  - Category
  - ISBN
  - Availability status
  - Actions (Edit/Delete)
- Add Book floating action button
- Add Book modal with form:
  - Title, Author, ISBN
  - Category dropdown
  - Publisher, Year
  - Description textarea
  - Cover image upload area

### Reports Screen (`/admin/reports`)
- Summary cards with trends
- Monthly Borrow Statistics (Bar chart)
- Category Distribution (Pie chart)
- Most Borrowed Books ranking
- Progress bars for book popularity

## Components

### Reusable Components
1. **BottomNavigation**: 5-tab navigation (Home, Search, Loans, Notifications, Profile)
2. **BookCard**: Book thumbnail with title, author, rating, availability
3. **CategoryChip**: Icon + label, active/inactive states
4. **LoanCard**: Book info with dates and status
5. **NotificationCard**: Icon, title, message, timestamp
6. **AdminSidebar**: Collapsible navigation for admin panel

## Navigation Flow
- Splash → Login → Home
- Home → Search → Book Detail → Borrow Confirmation → Success → Loans
- Bottom nav connects: Home, Search, Loans, Notifications, Profile
- Admin has separate routing with sidebar navigation

## Key Features
- ✅ Responsive design (mobile-first)
- ✅ Material Design principles
- ✅ Nielsen's Usability Heuristics
- ✅ Smooth animations with Motion
- ✅ Toast notifications with Sonner
- ✅ Charts with Recharts
- ✅ Form handling
- ✅ Empty states
- ✅ Loading states
- ✅ Success animations
- ✅ Color-coded status badges
- ✅ Accessible contrast ratios
- ✅ Large tap targets (min 44px)

## Mock Data
Located in `/src/app/data/mockData.ts`:
- 6 sample books with realistic data
- 3 loan records (active and returned)
- 4 notifications (mix of read/unread)

## Technologies Used
- React 18.3.1
- TypeScript
- React Router 7.13.0
- Tailwind CSS 4.1.12
- Motion (Framer Motion) 12.23.24
- Recharts 2.15.2
- Lucide React (icons)
- Sonner (toast notifications)

## Color Palette Usage
- **Primary (#2E7D32)**: Buttons, active states, accents
- **Secondary (#81C784)**: Gradients, secondary actions
- **Background (#F8F9FA)**: App background
- **Card (#ffffff)**: Cards, modals, overlays
- **Muted**: Secondary text, disabled states
- **Destructive**: Errors, delete actions, overdue status

## Future Enhancements
- User authentication with backend
- Real-time search with debouncing
- Book reservations system
- Fine payment integration
- QR code scanning for check-in/out
- Push notifications
- Dark mode support
- Multi-language support
