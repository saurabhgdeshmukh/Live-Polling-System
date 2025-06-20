import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Role from "./pages/students/role.jsx";
import Info from "./pages/students/info.jsx";
import Wait from "./pages/students/wait.jsx";
import QuestionCard from "./pages/students/QuestionCard.jsx";
import Kicked from "./pages/students/KickedPage.jsx";
import QuestionList from "./pages/teachers/QuestionList.jsx";
import PollHistory from "./pages/teachers/PollHistory.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Role />} />
        <Route path="/info" element={<Info />} />
        <Route path="/wait" element={<Wait />} />
        <Route path="/question" element={<QuestionCard />} />
        <Route path="/kicked" element={<Kicked />} />
        <Route path="/question-data" element={<QuestionList />} />
        <Route path="/history" element={<PollHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
