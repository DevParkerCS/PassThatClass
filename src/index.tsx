import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/colors.css";
import "./styles/borders.css";
import "./styles/variables.module.scss";
import { QuizContent } from "./Pages/Quiz/QuizContent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./Pages/Dashboard/Dashboard";
import { ClassFolder } from "./Pages/ClassFolder/ClassFolder";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Router>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/quiz" element={<QuizContent />} />
      <Route path="/class" element={<ClassFolder />} />
    </Routes>
  </Router>
);
