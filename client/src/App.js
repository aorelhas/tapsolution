import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from './components/layouts/Navbar';
import Alerts from './components/layouts/Alerts';

import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';

const App = () => {
  return (
    <AuthState>
      <AlertState>
        <Router>
          <Fragment>
            <Navbar />
            <div className="container">
              <Alerts />
              <Switch>
                <Route exact path="/" component={Landing} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
              </Switch>
            </div>
          </Fragment>
        </Router>
      </AlertState>
    </AuthState>
  );
};

export default App;
