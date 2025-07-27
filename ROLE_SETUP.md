# Role-Based Access Setup Guide

## Overview
Your ATS application now supports three user roles:
- **User** (default) - Regular users who can register for events
- **Committee** - Committee members who can manage events
- **Admin** - Administrators with full system access

## How to Set Up Admin and Committee Users

### Method 1: Using the Admin Panel (Recommended)

1. **First, create a regular user account** through the signup process
2. **Access the admin panel** at `/admin-panel` (you'll need admin access)
3. **Change user roles** using the dropdown in the admin panel

### Method 2: Manual Database Update

If you need to set up the first admin user, you can manually update the database:

1. **Sign up a regular user** through the application
2. **Go to Firebase Console** → Firestore Database
3. **Find the user document** in the `users` collection
4. **Update the `role` field** to either `"admin"` or `"committee"`

### Method 3: Using Browser Console

You can also use the provided script in your browser console:

```javascript
// First, get the user's UID from Firebase Auth or Firestore
const uid = "user-uid-here";

// Create admin user
createAdminUser(uid, {
  firstName: "Admin",
  lastName: "User", 
  email: "admin@example.com",
  phone: "1234567890",
  sapNumber: "12345678"
});

// Create committee user
createCommitteeUser(uid, {
  firstName: "Committee",
  lastName: "Member",
  email: "committee@example.com", 
  phone: "1234567890",
  sapNumber: "12345678"
});
```

## Dashboard Access

- **Regular Users** → `/dashboard/user`
- **Committee Members** → `/dashboard/committee`  
- **Administrators** → `/dashboard/admin`

## Security Features

✅ **Role-based routing** - Users are automatically redirected to their appropriate dashboard
✅ **Protected routes** - Users cannot access dashboards they don't have permission for
✅ **Admin panel** - Only admins can manage user roles
✅ **Automatic redirects** - Users are redirected to the correct dashboard after login

## Testing the System

1. **Create a regular user account**
2. **Log in** - should redirect to `/dashboard/user`
3. **Change role to admin** using the admin panel
4. **Log out and log back in** - should redirect to `/dashboard/admin`
5. **Test committee role** - should redirect to `/dashboard/committee`

## Troubleshooting

- **User stuck on loading**: Check if Firebase environment variables are set correctly
- **Wrong dashboard access**: Verify the user's role in Firestore database
- **Admin panel not accessible**: Ensure the user has `role: "admin"` in their document 