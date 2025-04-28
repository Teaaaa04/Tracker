const DeleteModal = ({ exercise, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Confirmar eliminación</h2>
        <p className="mb-4">
          Estás seguro de que deseas eliminar el ejercicio{" "}
          <strong>{exercise.nombre}</strong>?
        </p>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(exercise)}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
