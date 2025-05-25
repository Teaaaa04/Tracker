const ExerciseCard = ({ exercise, functions, exercisesState }) => {
  // Functions
  const addNewSet = (exercise) => {
    const updatedExercises = exercisesState.exercises.map((ex) =>
      ex.ejercicioid === exercise.ejercicioid
        ? {
            ...ex,
            series: [
              ...ex.series,
              {
                id: Date.now(),
                repeticiones: "",
                peso: "",
              },
            ],
          }
        : ex
    );
    exercisesState.setExercises(updatedExercises);
  };

  const editWorkout = (exercise) => {
    const updatedExercises = exercisesState.exercises.map((ex) =>
      ex.ejercicioid === exercise.ejercicioid ? { ...ex, isClosed: false } : ex
    );
    exercisesState.setExercises(updatedExercises);
  };

  const updateSetValue = (exerciseId, setId, field, value) => {
    const updatedExercises = exercisesState.exercises.map((exercise) =>
      exercise.ejercicioid === exerciseId
        ? {
            ...exercise,
            series: exercise.series.map((set) =>
              set.id === setId
                ? {
                    ...set,
                    [field]: value,
                  }
                : set
            ),
          }
        : exercise
    );
    exercisesState.setExercises(updatedExercises);
  };

  const deleteSet = (exerciseId, setId) => {
    const updatedExercises = exercisesState.exercises.map((exercise) =>
      exercise.ejercicioid === exerciseId
        ? {
            ...exercise,
            series: exercise.series.filter((set) => set.id !== setId),
          }
        : exercise
    );
    exercisesState.setExercises(updatedExercises);
  };

  return (
    <div
      key={exercise.ejercicioid}
      className={`bg-white rounded-lg shadow p-4 mb-6 ${
        exercise.isClosed ? "bg-gray-200" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-semibold">{exercise.nombre}</h3>
        <div className="flex space-x-2">
          {exercise.isClosed && (
            <button
              onClick={() => editWorkout(exercise)}
              className="px-4 py-1 bg-green-500 text-white text-sm rounded-md shadow transition duration-200"
            >
              Editar
            </button>
          )}
          <button
            onClick={() => functions.handleDeleteExercise(exercise)}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded-md shadow transition duration-200"
          >
            Eliminar
          </button>
        </div>
      </div>

      {exercise.series.length > 0 ? (
        <ul className="my-4">
          {exercise.series.map((set) => (
            <li
              key={set.id}
              className="flex justify-between mb-4 items-center border-b py-2"
            >
              <div className="flex items-center space-x-2 flex-1">
                {exercise.isClosed ? (
                  <span className="text-xl">
                    {set.repeticiones} x {set.peso}kg
                  </span>
                ) : (
                  <>
                    <input
                      type="number"
                      min="1"
                      placeholder="Reps"
                      value={set.repeticiones}
                      onChange={(e) =>
                        updateSetValue(
                          exercise.ejercicioid,
                          set.id,
                          "repeticiones",
                          e.target.value
                        )
                      }
                      className="border p-2 rounded w-1/3 text-center"
                    />
                    <span className="text-sm">x</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Peso"
                      value={set.peso}
                      onChange={(e) =>
                        functions.updateSetValue(
                          exercise.ejercicioid,
                          set.id,
                          "peso",
                          e.target.value
                        )
                      }
                      className="border p-2 rounded w-1/3 text-center"
                    />
                    <span>kg</span>
                  </>
                )}
              </div>
              {!exercise.isClosed && (
                <button
                  onClick={() => deleteSet(exercise.ejercicioid, set.id)}
                  className="text-red-400 text-xs ml-4"
                >
                  Eliminar
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 mb-2">
          No registraste series todavía
        </p>
      )}

      {!exercise.isClosed && (
        <>
          <div className="flex  mb-4">
            <button
              onClick={() => addNewSet(exercise)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Agregar serie
            </button>
          </div>

          <div className="text-right">
            <button
              onClick={() => functions.handleCloseExercise(exercise)}
              className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            >
              Guardar y cerrar ejercicio
            </button>
          </div>
        </>
      )}

      <div className="flex justify-between items-center mt-4">
        <p className="mt-2 text-xl font-semibold">
          Volumen: {functions.calculateExerciseVolume(exercise)} kg
        </p>
      </div>
    </div>
  );
};

export default ExerciseCard;
