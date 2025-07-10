import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminPage = () => {
  return (
    <main className="flex min-h-screen bg-gray-100">
      <aside className="w-[200px] bg-white shadow-md">
        <Sidebar />
      </aside>
      <section className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </section>
    </main>
  );
};

export default AdminPage;
