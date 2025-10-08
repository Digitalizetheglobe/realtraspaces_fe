# Admin Authentication System

This document describes the authentication system implemented for the admin routes in the Realtraspaces frontend application.

## Overview

The authentication system protects the following admin routes:
- `/dashboard` - Main admin dashboard
- `/career-management` - Job management system
- `/blog` - Blog management system  
- `/manage-testimonials` - Testimonial management system

## Components

### 1. useAuth Hook (`src/hooks/useAuth.ts`)

A custom React hook that manages authentication state and provides authentication utilities:

- **isAuthenticated**: Boolean indicating if user is logged in
- **adminData**: Admin user data object
- **isLoading**: Loading state while checking authentication
- **login(token, admin)**: Function to log in an admin user
- **logout()**: Function to log out and redirect to login page
- **requireAuth()**: Function to check if user is authenticated and redirect if not

### 2. ProtectedRoute Component (`src/components/ProtectedRoute.tsx`)

A higher-order component that wraps admin pages and:
- Shows loading spinner while checking authentication
- Redirects to `/dashboard/adminlogin` if not authenticated
- Renders the protected content if authenticated

## Implementation Details

### Authentication Flow

1. **Login**: Admin enters credentials on `/dashboard/adminlogin`
2. **Token Storage**: On successful login, token and admin data are stored in localStorage
3. **Route Protection**: All admin routes are wrapped with `ProtectedRoute` component
4. **Authentication Check**: `useAuth` hook checks localStorage for valid token on each page load
5. **Redirect**: If no valid token found, user is redirected to login page
6. **Logout**: Token and admin data are cleared from localStorage and user is redirected to login

### Protected Routes

All admin pages now include:
```tsx
import ProtectedRoute from '../../components/ProtectedRoute';

// Wrap the entire page content
return (
  <ProtectedRoute>
    {/* Page content */}
  </ProtectedRoute>
);
```

### Login Page Updates

The admin login page (`/dashboard/adminlogin`) now:
- Uses the `useAuth` hook for login functionality
- Automatically redirects to dashboard if already authenticated
- Stores authentication data using the hook's `login()` function

### Dashboard Updates

The main dashboard now:
- Uses the `useAuth` hook to access admin data and logout function
- Includes a logout button in the sidebar
- Shows admin information when available

## Security Features

1. **Client-side Protection**: Routes are protected on the client side
2. **Token-based Authentication**: Uses JWT tokens stored in localStorage
3. **Automatic Redirects**: Unauthenticated users are automatically redirected to login
4. **Loading States**: Shows loading indicators while checking authentication
5. **Logout Functionality**: Properly clears authentication data on logout

## Usage

### For New Admin Pages

To protect a new admin page:

1. Import the ProtectedRoute component:
```tsx
import ProtectedRoute from '../../components/ProtectedRoute';
```

2. Wrap your page content:
```tsx
return (
  <ProtectedRoute>
    {/* Your page content */}
  </ProtectedRoute>
);
```

### Accessing Authentication Data

To access authentication data in any component:

```tsx
import { useAuth } from '../../hooks/useAuth';

const MyComponent = () => {
  const { isAuthenticated, adminData, logout } = useAuth();
  
  // Use authentication data as needed
};
```

## API Integration

The authentication system integrates with the existing API endpoints:
- Login: `POST /api/admins/login`
- Token validation is handled client-side through localStorage

## Notes

- This is a client-side authentication system
- For production, consider implementing server-side session validation
- The system uses localStorage for token storage - consider using httpOnly cookies for enhanced security
- All admin routes are now protected and require authentication 