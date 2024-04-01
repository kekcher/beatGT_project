import AppRouter from "./routes/Routes";

import './global_styles/app.scss';
import './global_styles/media.scss';
import { createContext, useEffect } from "react";
import { useState } from "react";

export const AppContext = createContext();

function App() {
  const [deviceSize, setDeviceSize] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    let isMounted = true;

    function handleResize() {
      if (isMounted) {
          setDeviceSize(window.innerWidth)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize(); // Вызываем handleResize сразу, чтобы установить начальный размер устройства
    }

    // Функция-очистка
    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return (
    <AppContext.Provider
      value={{ deviceSize }}
    >
      <AppRouter />
    </AppContext.Provider>
  );
}

export default App;
