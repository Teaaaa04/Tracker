import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Workouts";
import Workout from "./pages/Exercises";
import UserSelect from "./UserSelect";
import Categories from "./pages/Categories";

export default function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen text-gray-800">
        <header className="bg-blue-500 text-white p-4 shadow-md">
          <h1 className="text-xl font-bold text-center">
            Tracker de entrenamientos
          </h1>
        </header>

        <Routes>
          <Route path="/categories" element={<Categories />} />
          <Route path="/workouts" element={<Home />} />
          <Route path="/" element={<UserSelect />} />
          <Route path="/exercisesa" element={<Workout />} />
        </Routes>
      </div>
    </Router>
  );
}
