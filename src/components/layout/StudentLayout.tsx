import React from 'react';
import { Outlet } from 'react-router-dom';
import { StudentNavbar } from './StudentNavbar';

export function StudentLayout() {
  return (
    <div className="min-h-screen bg-background">
      <StudentNavbar />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
