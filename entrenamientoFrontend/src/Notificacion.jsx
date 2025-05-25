import { useEffect } from "react";

const Notification = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm">{notification}</span>
      </div>
    </div>
  );
};

export default Notification;
