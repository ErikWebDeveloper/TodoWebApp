import { useState } from "react";
import { useLista } from "../context/ListaContext";
import { Link } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";

export default function ListaHome() {
  const { listas, createLista, deleteLista } = useLista();
  const [nombre, setNombre] = useState("");
  const { notifySuccess, notifyError, notifyInfo } = useNotification();

  const handleClick = () => {
    notifySuccess("¡Guardado con éxito!");
    notifyError("Ocurrió un error");
    notifyInfo("Esta es una información importante");
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">🗒️ Mis Listas</h1>

      <form className="row justify-content-center mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Nombre de la nueva lista"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                if (nombre.trim() === "") {
                  notifyError(
                    "El nombre de la lista no puede estar en blanco."
                  );
                  return;
                }
                createLista(nombre);
                setNombre("");
              }}
            >
              Crear
            </button>
          </div>
        </div>
      </form>

      <div className="row justify-content-center">
        <div className="col-md-8">
          {listas.length === 0 ? (
            <div className="alert alert-info text-center">
              No hay listas aún.
            </div>
          ) : (
            <ul className="list-group">
              {listas.map((lista) => (
                <li
                  key={lista.id}
                  className="list-group-item d-flex justify-content-between align-items-center bg-body-tertiary"
                >
                  <Link to={`/${lista.id}`} className="text-decoration-none">
                    {lista.nombre}
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      if (
                        window.confirm(
                          "¿Estás seguro de que quieres eliminar esta lista?"
                        )
                      ) {
                        deleteLista(lista.id);
                      }
                    }}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
