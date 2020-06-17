import React, { useState } from 'react';

export const Register = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = user;

  return <div>register</div>;
};

export default Register;
