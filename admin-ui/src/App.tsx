import { AppRouter } from "./router";
import { LanguageProvider } from "./context/LanguageContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ToastProvider>
      <LanguageProvider>
        <AppRouter />
      </LanguageProvider>
    </ToastProvider>
  );
}

export default App;
