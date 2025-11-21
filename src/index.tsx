import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/colors.css";
import "./styles/borders.css";
import { QuizContent } from "./Pages/Quiz/QuizContent";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./Pages/Dashboard/Dashboard";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/quiz" element={<QuizContent />} />
    </Routes>
  </Router>
);
