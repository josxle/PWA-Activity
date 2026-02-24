import { useState, useEffect } from 'react';
import './App.css';
import TaskManager from './components/TaskManager';
import Header from './components/Header';
import OfflineIndicator from './components/OfflineIndicator';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="app">
      <Header isOnline={isOnline} />
      <main className="app-main">
        <TaskManager />
      </main>
      {!isOnline && <OfflineIndicator />}
      <div className="app-footer">
        <p>© 2024 PWA Task Manager - Funciona sin conexión a internet</p>
      </div>
    </div>
  );
}

export default App;
