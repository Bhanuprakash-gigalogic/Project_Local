# React Admin Dashboard Boilerplate

This project is a modern Admin Dashboard boilerplate built with React, TypeScript, TailwindCSS, and React Query.
It includes a full layout system, typed utilities, and a set of accessible UI components.

## Features

- **Framework**: React + TypeScript + Vite (Recommended)
- **Styling**: TailwindCSS with CSS variables for dynamic theming (Dark Mode ready)
- **State Management**: Zustand (UI & Auth stores)
- **Data Fetching**: TanStack React Query + Typed Axios
- **Routing**: React Router v6 with Lazy Loading
- **UI Components**: 15+ reusable components (Button, Modal, Drawer, Table, etc.)
- **Icons**: Lucide React

## Setup Instructions

1. **Install Dependencies**

   Ensure you have a React Vite project structure. If starting from scratch:
   
   ```bash
   npm create vite@latest my-admin -- --template react-ts
   cd my-admin
   ```

   Install the required libraries used in this boilerplate:

   ```bash
   npm install axios @tanstack/react-query zustand react-router-dom lucide-react clsx tailwind-merge @radix-ui/react-dialog @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs class-variance-authority
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Integrate Generated Files**

   - Place the generated `src` folder content into your project's `src` folder.
   - Ensure `src/styles/globals.css` is imported in your `src/main.tsx` or `src/App.tsx`.
   - Configure Tailwind: Update `tailwind.config.js` to scan your files:
     
     ```js
     /** @type {import('tailwindcss').Config} */
     module.exports = {
       darkMode: ["class"],
       content: [
         './pages/**/*.{ts,tsx}',
         './components/**/*.{ts,tsx}',
         './app/**/*.{ts,tsx}',
         './src/**/*.{ts,tsx}',
       ],
       theme: {
         extend: {
             colors: {
                 border: "hsl(var(--border))",
                 input: "hsl(var(--input))",
                 ring: "hsl(var(--ring))",
                 background: "hsl(var(--background))",
                 foreground: "hsl(var(--foreground))",
                 primary: {
                   DEFAULT: "hsl(var(--primary))",
                   foreground: "hsl(var(--primary-foreground))",
                 },
                 secondary: {
                   DEFAULT: "hsl(var(--secondary))",
                   foreground: "hsl(var(--secondary-foreground))",
                 },
                 destructive: {
                   DEFAULT: "hsl(var(--destructive))",
                   foreground: "hsl(var(--destructive-foreground))",
                 },
                 muted: {
                   DEFAULT: "hsl(var(--muted))",
                   foreground: "hsl(var(--muted-foreground))",
                 },
                 accent: {
                   DEFAULT: "hsl(var(--accent))",
                   foreground: "hsl(var(--accent-foreground))",
                 },
                 popover: {
                   DEFAULT: "hsl(var(--popover))",
                   foreground: "hsl(var(--popover-foreground))",
                 },
                 card: {
                   DEFAULT: "hsl(var(--card))",
                   foreground: "hsl(var(--card-foreground))",
                 },
               },
         },
       },
       plugins: [require("tailwindcss-animate")],
     }
     ```
     *(Note: You might need `tailwindcss-animate` plugin for some transitions)*

3. **Routing Setup**

   In your `src/App.tsx` (or `main.tsx`), wrap your app with `QueryClientProvider` and `BrowserRouter`:

   ```tsx
   import { BrowserRouter } from 'react-router-dom';
   import { QueryClientProvider } from '@tanstack/react-query';
   import { queryClient } from './lib/queryClient';
   import AdminRoutes from './routes/admin.routes'; // The file we generated

   function App() {
     return (
       <QueryClientProvider client={queryClient}>
         <BrowserRouter>
           <AdminRoutes />
         </BrowserRouter>
       </QueryClientProvider>
     );
   }

   export default App;
   ```

4. **Create Page Components**

   The `admin.routes.tsx` file uses lazy imports for page components. You must create these files in `src/pages/admin/` to prevent build errors.
   
   Example `src/pages/admin/Dashboard.tsx`:
   
   ```tsx
   import React from 'react';
   
   const Dashboard = () => {
       return <div>Dashboard Content</div>;
   };
   
   export default Dashboard;
   ```
   
   Repeat for Users, Sellers, Products, etc.

5. **Start Development**

   ```bash
   npm run dev
   ```

## Folder Structure

```
src/
├── components/
│   └── ui/          # Generic UI components (Button, Input, etc.)
├── hooks/           # Custom hooks (useAuth, useToast)
├── layouts/         # Layout components (AdminLayout, Sidebar, Topbar)
├── lib/             # Utilities (axios, queryClient, utils)
├── pages/           # Feature pages (You need to create these)
├── routes/          # Routing configuration
├── store/           # Global state (Zustand)
└── styles/          # Global styles
```
