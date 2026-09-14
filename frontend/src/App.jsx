import { Route, Routes } from "react-router-dom";

import AppHeader from "./components/AppHeader";
import IntakePage from "./pages/IntakePage";
import SampleListPage from "./pages/SampleListPage";

function App() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-6 py-8">
        <Routes>
          <Route path="/" element={<IntakePage />} />
          <Route path="/samples" element={<SampleListPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
