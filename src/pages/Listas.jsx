import { useState } from "react";
import { useLista } from "../context/ListaContext";
import { Link } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { useDialog } from "../context/DialogContext";

export default function ListaHome() {
  const { listas, createLista, deleteLista } = useLista();
  const [nombre, setNombre] = useState("");
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const { confirm } = useDialog();

  const handleDelete = async (lista) => {
    const ok = await confirm({
      title: "Eliminar lista",
      message: "¿Estás seguro de que quieres eliminar esta lista?",
    });

    if (ok) {
      deleteLista(lista.id);
      notifyInfo(`Se ha eliminado la lista: ${lista.nombre}.`)
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center opacity-50">
        <i className="bi bi-journal-text me-2"></i>Mis Listas
      </h1>

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
                notifySuccess("Lista creada con éxito!")
              }}
            >
              <i className="bi bi-plus-lg me-1"></i>Crear
            </button>
          </div>
        </div>
      </form>

      <div className="row justify-content-center">
        <div className="col-md-8">
          {listas.length === 0 ? (
            <div className="alert alert-info text-center">
              <i className="bi bi-info-circle me-2"></i>No hay listas aún.
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
                      handleDelete(lista);
                    }}
                  >
                    <i className="bi bi-trash"></i>
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
