import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminNavbar } from './AdminNavbar';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
