// context/DialogContext.jsx
import { createContext, useContext, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";

const DialogContext = createContext();

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const confirm = ({ title, message }) =>
    new Promise((resolve) => {
      setDialog({
        title,
        message,
        onConfirm: () => {
          resolve(true);
          close();
        },
        onCancel: () => {
          resolve(false);
          close();
        },
      });
    });

  const close = () => setDialog(null);

  return (
    <DialogContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <ConfirmDialog
          title={dialog.title}
          message={dialog.message}
          onConfirm={dialog.onConfirm}
          onCancel={dialog.onCancel}
        />
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  return useContext(DialogContext);
}
