import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import Landing from './components/layouts/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from './components/layouts/Navbar';

import AuthState from './context/auth/AuthState';

const App = () => {
  return (
    <AuthState>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
          </Switch>
        </Fragment>
      </Router>
    </AuthState>
  );
};

export default App;
