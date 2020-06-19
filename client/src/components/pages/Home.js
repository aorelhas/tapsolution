import React, { useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';

const Home = () => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    authContext.loadUser();

    //eslint-disable-next-line
  }, []);

  return <div>Home After Login</div>;
};

export default Home;
