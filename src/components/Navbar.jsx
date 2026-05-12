import { Link } from "react-router";

function Navbar({ user, setUser, setCat }) {
  function logOut() {
    localStorage.removeItem("token");
    setUser(null);
    setCat(null);
  }

  return (
    <nav className="navbar">
      {/* Routes seen by everyone */}
      <div className="nav-left">
        <Link className="logo" to="/">
          MeowFocus
        </Link>
      </div>

      <div className="nav-right">
        {user ? (
          // Links for protected routes only for logged in users
          <>
            <Link className="nav-item" to="/dashboard">
              Dashboard
            </Link>

            <span className="nav-item">{user.username}</span>

            <button className="nav-item" onClick={logOut}>
              Log Out
            </button>
          </>
        ) : (
          // links for not logged in users
          <>
            <Link className="nav-item" to="/sign-up">
              Sign up
            </Link>
            <Link className="nav-item" to="/sign-in">
              Sign in
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
