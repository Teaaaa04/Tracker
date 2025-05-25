import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Workouts";
import Workout from "./pages/Exercises";
import Categories from "./pages/Categories";
import GoogleLogin from "./pages/GoogleLogin";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/categories" element={<Categories />} />
        <Route path="/workouts" element={<Home />} />
        <Route path="/" element={<GoogleLogin />} />
        <Route path="/exercises" element={<Workout />} />
      </Routes>
    </Router>
  );
}
