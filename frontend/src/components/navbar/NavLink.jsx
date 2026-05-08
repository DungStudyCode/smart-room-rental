import { Link } from 'react-router-dom';

const NavLink = ({ to, label, active }) => (
  <Link 
    to={to} 
    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all ${
      active 
        ? 'border-purple-600 text-purple-700' 
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {label}
  </Link>
);

export default NavLink;