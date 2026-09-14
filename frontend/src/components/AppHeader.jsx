import { NavLink } from "react-router-dom";

function navLinkClassName({ isActive }) {
  const base = "rounded px-3 py-1.5 text-sm font-medium";
  if (isActive) {
    return `${base} bg-slate-900 text-white`;
  }
  return `${base} text-slate-600 hover:bg-slate-100`;
}

export default function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <h1 className="text-lg font-semibold">Lab Intake</h1>
        <nav className="flex gap-2">
          <NavLink to="/" end className={navLinkClassName}>
            Intake
          </NavLink>
          <NavLink to="/samples" className={navLinkClassName}>
            Samples
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
