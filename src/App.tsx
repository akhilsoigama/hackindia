import "./App.css";
import { TranslateProvider } from "./context/translaterProvider.tsx";
import { UserProvider } from "./context/userProvider.tsx";
import Routers from "./routers/routes.tsx";

function App() {
  return (
    <div className="w-full">
      <UserProvider>
        <TranslateProvider>
          <Routers/>
        </TranslateProvider>
      </UserProvider>
    </div >
  );
}

export default App;
