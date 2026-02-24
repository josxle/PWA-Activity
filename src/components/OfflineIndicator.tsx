import './OfflineIndicator.css';

function OfflineIndicator() {
  return (
    <div className="offline-indicator">
      <span className="offline-icon">⚠️</span>
      <span className="offline-text">Trabajando sin conexión - Los cambios se sincronizarán cuando vuelva</span>
    </div>
  );
}

export default OfflineIndicator;
