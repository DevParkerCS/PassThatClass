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

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Router>
    <DataProvider>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/class/:id" element={<ClassFolder />} />
        <Route path="/class/:classId/quiz/:quizId" element={<QuizContent />} />
        <Route path="/class/:id/newQuiz" element={<NewQuiz />} />
      </Routes>
    </DataProvider>
  </Router>
);
