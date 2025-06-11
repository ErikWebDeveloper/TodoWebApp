import { createContext, useContext, useState, useCallback } from "react";
import NotificationCenter from "../components/NotificationCenter";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, message) => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { id, type, message }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const value = {
    notifySuccess: (msg) => addNotification("success", msg),
    notifyError: (msg) => addNotification("danger", msg),
    notifyInfo: (msg) => addNotification("info", msg),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationCenter notifications={notifications} />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
