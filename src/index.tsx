import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import "./styles/colors.css";
import "./styles/borders.css";
import "./styles/widths.module.scss";
import "./styles/variables.module.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ClassesProvider } from "./context/DataContext/ClassesContext";
import { ContentProvider } from "./context/DataContext/ContentContext";
import { AuthProvider } from "./context/AuthContext/AuthContext";
import { routes } from "./components/Routes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // optional: scroll to top on route change
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}

root.render(
  <Router>
    <ScrollToHash />
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
