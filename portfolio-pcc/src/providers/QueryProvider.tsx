"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // Dữ liệu được xem là mới trong 5 phút (Cache Hit 0ms)
            gcTime: 30 * 60 * 1000, // Giữ trong bộ nhớ RAM 30 phút
            refetchOnWindowFocus: false, // Không tự động gọi lại khi focus tab
            retry: 1, // Tự động thử lại 1 lần nếu gặp sự cố mạng
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
