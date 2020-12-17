import React from 'react';
import GoogleLogin from 'react-google-login';

const LoginScreen = () => {
  const responseGoogle = (response) => {
    console.log(response);
  };

  return (
    <div className="registration-form">
      <form className="form">
        <div className="form-icon">
          <span>
            <i className="far fa-user"></i>
          </span>
        </div>
        <div className="form-group">
          <GoogleLogin
            clientId="302461378214-eg67gbtvu72g9ho2rrn6d4j5obvseo79.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
        </div>
      </form>
    </div>
  );
};

export default LoginScreen;
