import React, { Fragment, useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: '#5FAD56' };
  } else {
    return { color: '#A8A8A8' };
  }
};

export const Navbar = ({ history }) => {
  const authContext = useContext(AuthContext);

  const { isAuthenticated, logout, user } = authContext;

  const onLogout = () => {
    logout();
  };

  const authLinks = (
    <Fragment>
      <li>Hello {user && user.name}</li>
      <li>
        <a onClick={onLogout} href="#!">
          Logout
        </a>
      </li>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <li className="nav-item">
        <Link
          to="/login"
          className="nav-link"
          style={isActive(history, '/login')}
        >
          Login
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/register"
          className="nav-link"
          style={isActive(history, '/register')}
        >
          Register
        </Link>
      </li>
    </Fragment>
  );

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand">TapSolution</a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <Link to="/" className="nav-link" style={isActive(history, '/')}>
                Home
              </Link>
            </li>
            {isAuthenticated ? authLinks : guestLinks}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default withRouter(Navbar);
