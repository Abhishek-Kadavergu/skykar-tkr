import { FaMoon, FaSun } from 'react-icons/fa';
import { useDarkMode } from '../context/DarkModeContext';

/**
 * Dark Mode Toggle Button - Feature #20
 * Can be placed in Navbar or as floating button
 */
function DarkModeToggle({ className = '' }) {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className={`p-2 rounded-lg transition-all hover:scale-110 ${
        darkMode
          ? 'bg-yellow-400 text-slate-900 hover:bg-yellow-300'
          : 'bg-slate-700 text-yellow-300 hover:bg-slate-600'
      } ${className}`}
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle dark mode"
    >
      {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
    </button>
  );
}

export default DarkModeToggle;
