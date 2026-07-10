import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
