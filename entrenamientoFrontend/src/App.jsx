import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Workout from "./Workout";
import UserSelect from "./UserSelect";
import Categories from "./Categories";

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
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<UserSelect />} />
          <Route path="/workout" element={<Workout />} />
        </Routes>
      </div>
    </Router>
  );
}
