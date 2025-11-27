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

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Router>
    <DataProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Authentication />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/class/:id" element={<ClassFolder />} />
          <Route
            path="/class/:classId/quiz/:quizId"
            element={<QuizContent />}
          />
          <Route path="/class/:id/newQuiz" element={<NewQuiz />} />
        </Routes>
      </AuthProvider>
    </DataProvider>
  </Router>
);
