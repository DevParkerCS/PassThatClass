import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import "./styles/colors.css";
import "./styles/borders.css";
import "./styles/widths.module.scss";
import "./styles/variables.module.scss";
import { QuizContent } from "./Pages/Quiz/QuizContent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./Pages/Dashboard/Dashboard";
import { ClassFolder } from "./Pages/ClassFolder/ClassFolder";
import { DataProvider } from "./context/DataContext/DataContext";
import { NewQuiz } from "./Pages/NewQuiz/NewQuiz";
import { LandingPage } from "./Pages/LandingPage/LandingPage";
import { Authentication } from "./Pages/Authentication/Authentication";
import { AuthProvider } from "./context/AuthContext/AuthContext";
import { routes } from "./components/Routes";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
console.log(routes);
root.render(
  <Router>
    <AuthProvider>
      <DataProvider>
        <Routes>
          {routes.map(({ element: PageElement, ...r }) => (
            <Route path={r.path} element={<PageElement />} />
          ))}
        </Routes>
      </DataProvider>
    </AuthProvider>
  </Router>
);
