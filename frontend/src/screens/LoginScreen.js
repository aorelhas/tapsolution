import React from 'react';
import GoogleLogin from 'react-google-login';
import dotenv from 'dotenv'

dotenv.config();

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
            clientId={process.env.REACT_GOOGLE_CLIENT_ID}
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
