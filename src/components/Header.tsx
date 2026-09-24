import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors no-underline ${
      isActive ? "text-blue-400 font-bold" : "text-gray-300 hover:text-white"
    }`;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💼</span>
          <span className="text-white font-bold text-lg">Job Tracker</span>
        </div>

        <div className="flex items-center gap-6">
          <NavLink to="/" className={navLinkClass}>
            Dashboard
          </NavLink>
          {isLoggedIn && (
            <NavLink to="/add" className={navLinkClass}>
              Add Application
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <NavLink to="/profile" className={navLinkClass}>
                <span className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-full bg-blue-600
                                   text-white flex items-center
                                   justify-center text-xs font-bold"
                  >
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                  <span className="text-gray-300 text-sm">
                    {user?.name || "Profile"}
                  </span>
                </span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white
                           bg-red-600 rounded-lg hover:bg-red-700
                           transition-colors border-none cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="px-4 py-2 text-sm font-medium text-white
                         bg-blue-600 rounded-lg hover:bg-blue-700
                         transition-colors no-underline"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
