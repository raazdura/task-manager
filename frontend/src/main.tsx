import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import TaskProvider from './context/taskContext.tsx'; // Import TaskProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TaskProvider> {/* Wrap the App with TaskProvider */}
      <App />
    </TaskProvider>
  </StrictMode>
);
