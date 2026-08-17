"use client";

import { pdfjs, Document, Page } from "react-pdf";
import { useState, useEffect } from "react";
import { usePortfolio } from "@/context/PortfolioContext";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure worker safely for client-side
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc =
    new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString() ||
    `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

export default function CVPreview() {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const { data } = usePortfolio();

  const initialFile = data?.personal?.cvUrl?.endsWith(".pdf")
    ? data.personal.cvUrl
    : "/pdfs/cv.pdf";

  const [currentFile, setCurrentFile] = useState<string>(initialFile);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (data?.personal?.cvUrl?.endsWith(".pdf")) {
      setCurrentFile(data.personal.cvUrl);
    }
  }, [data?.personal?.cvUrl]);

  if (!mounted) {
    return <div className="w-[300px] h-[400px] bg-slate-800/30 rounded-lg animate-pulse" />;
  }

  return (
    <div className="h-full flex justify-center items-center">
      <Document
        key={currentFile}
        file={currentFile}
        onLoadSuccess={({ numPages: pages }) => setNumPages(pages)}
        onLoadError={() => {
          if (currentFile !== "/pdfs/cv.pdf") {
            setCurrentFile("/pdfs/cv.pdf");
          }
        }}
        loading={
          <div className="w-[300px] h-[400px] flex items-center justify-center text-sm text-gray-400 bg-slate-800/30 rounded-lg">
            Loading preview...
          </div>
        }
        error={
          <div className="w-[300px] h-[400px] flex items-center justify-center text-sm text-red-400 bg-slate-800/30 rounded-lg">
            Cannot preview CV
          </div>
        }
      >
        {numPages ? (
          <Page
            pageNumber={1}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            scale={0.9}
          />
        ) : null}
      </Document>
    </div>
  );
}
