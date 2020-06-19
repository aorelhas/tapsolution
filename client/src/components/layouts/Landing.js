import React, { useContext, useEffect } from 'react';
import AuthContext from '../../context/auth/authContext';

export const Landing = () => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    authContext.loadUser();

    //eslint-disable-next-line
  }, []);

  return <div>Landing Page</div>;
};

export default Landing;
