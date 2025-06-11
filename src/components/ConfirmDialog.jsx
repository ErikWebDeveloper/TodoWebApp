// components/ConfirmDialog.jsx
export default function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow">
            <div className="modal-header bg-body-tertiary">
              <h5 className="modal-title">{title}</h5>
            </div>
            <div className="modal-body">
              <p>{message}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={onCancel}>
                Cancelar
              </button>
              <button className="btn btn-danger btn-sm" onClick={onConfirm}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}
