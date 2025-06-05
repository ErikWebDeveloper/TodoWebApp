import { Routes, Route } from "react-router-dom";
import { ListaProvider } from "./context/ListaContext";
//import { ListaProvider } from "./context/ListaContextGPT";
import Listas from "./pages/Listas";
import ListaDetalle from "./pages/ListaDetalle";

function App() {
  return (
    <ListaProvider>
      <Routes>
        <Route path="/" element={<Listas />} />
        <Route path="/:id" element={<ListaDetalle />} />
      </Routes>
    </ListaProvider>
  );
}

export default App;
