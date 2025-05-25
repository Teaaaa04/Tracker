import { useState } from "react";

const WorkoutHeader = ({ exercises, setExercises, setNotification }) => {
  const [showMenu, setShowMenu] = useState(false);

  const copiarRutina = async () => {
    const rutinaData = {
      ejercicios: exercises.map((ejercicio) => ({
        nombre: ejercicio.nombre,
        series: ejercicio.series
          .filter((serie) => serie.repeticiones && serie.peso)
          .map((serie) => ({
            repeticiones: Number(serie.repeticiones),
            peso: Number(serie.peso),
          })),
      })),
    };

    const jsonString = JSON.stringify(rutinaData, null, 2);
    await navigator.clipboard.writeText(jsonString);

    setNotification("Rutina copiada");

    localStorage.setItem("copiedWorkout", jsonString);
  };

  const pegarRutina = async () => {
    if (!localStorage.getItem("copiedWorkout")) {
      setNotification("No hay rutina copiada");
      return;
    }

    const copiedWorkoutData = localStorage.getItem("copiedWorkout");

    const rutinaData = JSON.parse(copiedWorkoutData);

    const nuevosEjercicios = rutinaData.ejercicios.map((ejercicio, index) => ({
      ejercicioid: Date.now() + index,
      nombre: ejercicio.nombre,
      series: ejercicio.series.map((serie, serieIndex) => ({
        id: Date.now() + index * 1000 + serieIndex,
        repeticiones: serie.repeticiones.toString(),
        peso: serie.peso.toString(),
      })),
      isClosed: false,
    }));

    setExercises([...exercises, ...nuevosEjercicios]);

    localStorage.removeItem("copiedWorkout");
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold mb-4">Detalles del entrenamiento</h1>

      <div className="relative mb-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Opciones de rutina"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {showMenu && (
          <div className="absolute top-8 right-3 bg-white rounded-lg shadow-lg border z-10 min-w-48">
            <div className="py-1">
              <button
                onClick={() => {
                  copiarRutina();
                  setShowMenu(false);
                }}
                disabled={exercises.length === 0}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 ${
                  exercises.length === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copiar Rutina
              </button>

              <button
                onClick={() => {
                  pegarRutina();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center gap-3"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Pegar Rutina
              </button>
            </div>
          </div>
        )}
      </div>
      {showMenu && (
        <div className="fixed inset-0 z-5" onClick={() => setShowMenu(false)} />
      )}
    </div>
  );
};

export default WorkoutHeader;
