import './Header.css';

interface HeaderProps {
  isOnline: boolean;
}

function Header({ isOnline }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>📝 Task Manager</h1>
          <p>PWA Offline-First</p>
        </div>
        <div className="header-status">
          <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
          <span className="status-text">
            {isOnline ? 'Conectado' : 'Sin conexión'}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
