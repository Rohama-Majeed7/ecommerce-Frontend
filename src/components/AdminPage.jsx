import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminPage = () => {
  return (
    <main className="flex min-h-screen bg-gray-100">
      <aside className=" bg-white border-r-2 border-[#0078D7] shadow-md w-fit">
        <Sidebar />
      </aside>
      <section className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </section>
    </main>
  );
};

export default AdminPage;
