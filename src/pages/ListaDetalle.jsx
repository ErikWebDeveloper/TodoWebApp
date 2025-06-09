import { Link, useParams } from "react-router-dom";
import { useLista } from "../context/ListaContext";
import { useState, useEffect } from "react";

export default function ListaDetalle() {
  const { id } = useParams();
  const { getLista, updateLista, addItem, deleteItem, updateItem, reorderItems } = useLista();
  const lista = getLista(id);
  const [contenido, setContenido] = useState("");
  const [nombre, setNombre] = useState(lista?.nombre || "");
  const [mostrarChecks, setMostrarChecks] = useState(false);

  const [editandoNombre, setEditandoNombre] = useState(false);
  const [editandoItemId, setEditandoItemId] = useState(null);
  const [nuevoContenido, setNuevoContenido] = useState("");


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
    reorderItems(id, itemId, direccion);
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to={"/"} className="text-decoration-none fs-5">
          ❮❮ Volver a mis listas
        </Link>
      </div>
      <div className="mb-4 text-center">
        <label htmlFor="nombreLista" className="form-label visually-hidden">
          Nombre de la lista
        </label>

        {editandoNombre ? (
          <input
            id="nombreLista"
            type="text"
            className="form-control px-0 fs-1 text-center m-0"
            style={{ lineHeight: "1", height: "auto" }}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onBlur={() => {
              const nombreLimpio = nombre.trim();
              if (nombreLimpio === "") {
                alert("El nombre de la lista no puede estar vacío.");
                setNombre(lista.nombre); // Restaurar el anterior
              } else {
                updateLista(id, nombreLimpio);
              }
              setEditandoNombre(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.target.blur();
              }
            }}
            autoFocus
          />
        ) : (
          <h1
            className="fs-1"
            onDoubleClick={() => setEditandoNombre(true)}
            style={{ cursor: "pointer" }}
            title="Doble clic para editar"
          >
            {nombre}
          </h1>
        )}

        <div id="nombreListaHelp" className="form-text">
          Haz doble clic en el título o un ítem para modificarlo.
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
              if (contenido.trim() === ""){
                alert(
                  "Por favor, escribe un contenido antes de añadir un ítem."
                );
                return;
              };
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
        {itemsOrdenados.map((item) => {
          const estaEditando = editandoItemId === item.id;

          return (
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

                {estaEditando ? (
                  <input
                    className="form-control me-2"
                    value={nuevoContenido}
                    onChange={(e) => setNuevoContenido(e.target.value)}
                    onBlur={() => {
                      const contenidoLimpio = nuevoContenido.trim();
                      if (contenidoLimpio === "") {
                        alert("El contenido del ítem no puede estar vacío.");
                      } else {
                        updateItem(
                          id,
                          item.id,
                          contenidoLimpio,
                          item.orden,
                          item.completado
                        );
                      }
                      setEditandoItemId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.target.blur();
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span
                    className="me-2"
                    onDoubleClick={() => {
                      setEditandoItemId(item.id);
                      setNuevoContenido(item.contenido);
                    }}
                    style={{ cursor: "pointer" }}
                    title="Doble clic para editar"
                  >
                    {item.contenido}
                  </span>
                )}
              </div>

              <div className="btn-group btn-group-md" role="group">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleOrdenChange(item.id, "arriba")}
                >
                  ⬆️
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleOrdenChange(item.id, "abajo")}
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
                >
                  🗑️
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
