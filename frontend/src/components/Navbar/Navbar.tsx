import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Main</Link>
        </li>
        <li>
          <Link to="/test">Settings</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
