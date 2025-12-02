import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import "./styles/colors.css";
import "./styles/borders.css";
import "./styles/widths.module.scss";
import "./styles/variables.module.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClassesProvider } from "./context/DataContext/ClassesContext";
import { ContentProvider } from "./context/DataContext/ContentContext";
import { AuthProvider } from "./context/AuthContext/AuthContext";
import { routes } from "./components/Routes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Router>
    <AuthProvider>
      <ClassesProvider>
        <ContentProvider>
          <Routes>
            {routes.map(({ element: PageElement, ...r }) => (
              <Route path={r.path} element={<PageElement />} />
            ))}
          </Routes>
        </ContentProvider>
      </ClassesProvider>
    </AuthProvider>
  </Router>
);
