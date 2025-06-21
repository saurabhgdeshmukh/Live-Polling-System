import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Role from "./pages/common/role.jsx";
import Info from "./pages/students/info.jsx";
import QuestionCard from "./pages/common/QuestionCard.jsx";
import QuestionList from "./pages/teachers/QuestionList.jsx";
import PollHistory from "./pages/teachers/PollHistory.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Role />} />
        <Route
          path="/info"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Info />
            </ProtectedRoute>
          }
        />

        <Route
          path="/question"
          element={
            <ProtectedRoute allowedRoles={["student","teacher"]}>
              <QuestionCard />
            </ProtectedRoute>
          }
        />

        {/* Teacher-only routes */}
        <Route
          path="/question-data"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <QuestionList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <PollHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
