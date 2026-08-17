import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ToastContainer } from "../common/Toast";
import { AdminLayoutContext } from "./AdminLayoutContext";

export const AdminLayout: React.FC = () => {
  const [saveSlot, setSaveSlot] = useState<React.ReactNode>(null);

  return (
    <AdminLayoutContext.Provider value={{ setSaveSlot }}>
      <div className="flex min-h-screen bg-bg">
        <Sidebar />
        <div className="flex flex-1 flex-col" style={{ marginLeft: "240px" }}>
          <Topbar saveSlot={saveSlot} />
          <main className="flex-1 overflow-y-auto pt-14">
            <div className="min-h-full p-6">
              <Outlet />
            </div>
          </main>
        </div>
        <ToastContainer />
      </div>
    </AdminLayoutContext.Provider>
  );
};
