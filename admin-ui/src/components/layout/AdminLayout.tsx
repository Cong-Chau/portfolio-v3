import React, { createContext, useContext, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ToastContainer } from "../common/Toast";

interface AdminLayoutContextValue {
  setSaveSlot: (node: React.ReactNode) => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextValue>({
  setSaveSlot: () => {},
});

export const useAdminLayout = () => useContext(AdminLayoutContext);

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [saveSlot, setSaveSlot] = useState<React.ReactNode>(null);

  return (
    <AdminLayoutContext.Provider value={{ setSaveSlot }}>
      <div className="flex min-h-screen bg-bg">
        <Sidebar />
        <div className="flex flex-1 flex-col" style={{ marginLeft: "240px" }}>
          <Topbar saveSlot={saveSlot} />
          <main className="flex-1 overflow-y-auto pt-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="min-h-full p-6"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <ToastContainer />
      </div>
    </AdminLayoutContext.Provider>
  );
};
