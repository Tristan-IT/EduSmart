import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SubjectProvider } from "./context/SubjectContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SubjectProvider>
      <App />
    </SubjectProvider>
  </AuthProvider>
);
