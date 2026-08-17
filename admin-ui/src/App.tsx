import { AppRouter } from "./router";
import { LanguageProvider } from "./context/LanguageProvider";
import { ToastProvider } from "./context/ToastProvider";

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
