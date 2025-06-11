import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { ListaProvider } from "./context/ListaContext";
import { NotificationProvider } from "./context/NotificationContext";
import { DialogProvider } from "./context/DialogContext";
import MainLayout from "./layouts/MainLayout";
import Listas from "./pages/Listas";
import ListaDetalle from "./pages/ListaDetalle";
import SettingsPage from "./pages/Settings";

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <DialogProvider>
          <ListaProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/" element={<Listas />} />
                <Route path="/:id" element={<ListaDetalle />} />
              </Route>
            </Routes>
          </ListaProvider>
        </DialogProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
