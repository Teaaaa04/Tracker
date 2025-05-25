import { useState } from "react";

const AddExerciseForm = ({ exercises, setExercises }) => {
  const [exerciseName, setExerciseName] = useState("");

  const addExercise = () => {
    if (exerciseName.trim() === "") return;
    const newExercise = {
      ejercicioid: Date.now(),
      nombre: exerciseName,
      series: [
        {
          id: Date.now(),
          repeticiones: "",
          peso: "",
        },
      ],
      isClosed: false,
    };
    setExercises([...exercises, newExercise]);
    setExerciseName("");
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Agregar ejercicio</h2>
      <div className="flex">
        <input
          type="text"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
          placeholder="Nombre del ejercicio"
          className="border p-2 rounded-l w-full"
        />
        <button
          onClick={addExercise}
          className="bg-blue-500 text-white px-4 rounded-r"
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default AddExerciseForm;
