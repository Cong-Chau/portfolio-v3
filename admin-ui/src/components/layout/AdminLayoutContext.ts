import React, { createContext, useContext } from "react";

export interface AdminLayoutContextValue {
  setSaveSlot: (node: React.ReactNode) => void;
}

export const AdminLayoutContext = createContext<AdminLayoutContextValue>({
  setSaveSlot: () => {},
});

export const useAdminLayout = () => useContext(AdminLayoutContext);
