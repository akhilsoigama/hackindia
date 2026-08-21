import "./App.css";
import { TranslateProvider } from "./context/translaterProvider.tsx";
import { UserProvider } from "./context/userProvider.tsx";
import { Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from '@/theme/AppThemeProvider';

const Routers = lazy(() => import("./routers/routes.tsx"));

function App() {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const location = useLocation();
  const isLogin = location.pathname.startsWith('/login');
  return (
    <div className={`${isDark ? 'isDark' : ''} ${isDark && !isLogin ? 'bg-slate-950/70' : ''} w-full max-w-full`} style={{ boxSizing: 'border-box'}} suppressHydrationWarning>
      <UserProvider>
        <TranslateProvider>
          <Suspense fallback={<div className="min-h-screen " aria-busy="true" />}>
            <Routers />
          </Suspense>
        </TranslateProvider>
      </UserProvider>
    </div >
  );
}

export default App;
