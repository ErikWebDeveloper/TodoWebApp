import { Link, useParams } from "react-router-dom";
import { useLista } from "../context/ListaContext";
import { useState, useEffect } from "react";

export default function ListaDetalle() {
  const { id } = useParams();
  const { getLista, updateLista, addItem, deleteItem, updateItem } = useLista();
  const lista = getLista(id);
  const [contenido, setContenido] = useState("");
  const [nombre, setNombre] = useState(lista?.nombre || "");
  const [mostrarChecks, setMostrarChecks] = useState(false);

  useEffect(() => {
    if (lista?.nombre) {
      setNombre(lista.nombre);
    }
  }, [lista?.nombre]);

  if (!lista)
    return (
      <div className="container py-5 text-center">
        <p className="alert alert-warning">Lista no encontrada</p>
      </div>
    );

  const itemsOrdenados = [...(lista.items || [])].sort(
    (a, b) => a.orden - b.orden
  );

  const handleOrdenChange = (itemId, direccion) => {
    const index = itemsOrdenados.findIndex((i) => i.id === itemId);
    if (index === -1) return;

    const nuevoOrden = [...itemsOrdenados];
    const swapIndex = direccion === "arriba" ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= nuevoOrden.length) return;

    const temp = nuevoOrden[index].orden;
    nuevoOrden[index].orden = nuevoOrden[swapIndex].orden;
    nuevoOrden[swapIndex].orden = temp;

    updateItem(
      id,
      nuevoOrden[index].id,
      nuevoOrden[index].contenido,
      nuevoOrden[index].orden
    );
    updateItem(
      id,
      nuevoOrden[swapIndex].id,
      nuevoOrden[swapIndex].contenido,
      nuevoOrden[swapIndex].orden
    );
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to={"/"} className="text-decoration-none fs-5">❮❮ Volver a mis listas</Link>
      </div>
      <div className="mb-4 text-center">
        <label htmlFor="nombreLista" className="form-label visually-hidden">
          Nombre de la lista
        </label>
        <input
          id="nombreLista"
          type="text"
          className="form-control border-0 px-0 fs-1 text-center"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onBlur={() => updateLista(id, nombre)}
          aria-describedby="nombreListaHelp"
        />
        <div id="nombreListaHelp" className="form-text">
          Toca el nombre de la lista para editarlo.
        </div>
      </div>

      <form className="mb-4">
        <label htmlFor="nuevoItem" className="form-label visually-hidden">
          Nuevo ítem
        </label>
        <div className="input-group">
          <input
            id="nuevoItem"
            type="text"
            className="form-control"
            placeholder="Escribe un nuevo ítem ..."
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
          />
          <button
            className="btn btn-success"
            onClick={(e) => {
              e.preventDefault();
              if (contenido.trim() === "") return;
              addItem(lista.id, contenido);
              setContenido("");
            }}
          >
            Añadir
          </button>
        </div>
      </form>

      <div className="d-flex justify-content-start align-items-center mt-3 mb-4 gap-1 p-2">
        <div
          className="form-check form-switch"
          style={{ transform: "scale(1.3)" }}
        >
          <input
            className="form-check-input cursor-pointer"
            type="checkbox"
            role="switch"
            id="mostrarChecksSwitch"
            checked={mostrarChecks}
            onChange={() => setMostrarChecks(!mostrarChecks)}
          />
        </div>
        <label
          className="form-check-label me-2 mb-0 text-secondary"
          htmlFor="mostrarChecksSwitch"
          style={{ whiteSpace: "nowrap" }}
        >
          {mostrarChecks ? "Desactivar checks" : "Activar checks"}
        </label>
      </div>

      <ul className="list-group">
        {itemsOrdenados.map((item, i) => (
          <li
            key={item.id}
            className={`list-group-item d-flex justify-content-between align-items-center bg-body-tertiary ${
              item.completado && mostrarChecks
                ? "text-decoration-line-through opacity-50"
                : ""
            }`}
          >
            <div className="d-flex align-items-center">
              {mostrarChecks && (
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={item.completado || false}
                  onChange={() =>
                    updateItem(
                      id,
                      item.id,
                      item.contenido,
                      item.orden,
                      !item.completado
                    )
                  }
                  aria-label={`Marcar ${item.contenido} como ${
                    item.completado ? "incompleto" : "completado"
                  }`}
                />
              )}
              <span>{item.contenido}</span>
            </div>

            <div
              className="btn-group btn-group-md"
              role="group"
              aria-label={`Controles para ${item.contenido}`}
            >
              <button
                className="btn btn-outline-secondary"
                onClick={() => handleOrdenChange(item.id, "arriba")}
                aria-label="Mover hacia arriba"
              >
                ⬆️
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => handleOrdenChange(item.id, "abajo")}
                aria-label="Mover hacia abajo"
              >
                ⬇️
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => {
                  if (
                    window.confirm(
                      "¿Estás seguro de que quieres eliminar este ítem?"
                    )
                  ) {
                    deleteItem(lista.id, item.id);
                  }
                }}
                aria-label="Eliminar ítem"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
