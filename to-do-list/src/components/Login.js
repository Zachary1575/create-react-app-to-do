import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

function Login({ setIsLoggedIn, setToken }) {
    return (
        <div>
            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    console.log(credentialResponse);
                    setIsLoggedIn(true);
                    setToken(credentialResponse)
                }}
                onError={() => {
                    console.log('Login Failed!');
                }}
            />
        </div>
    );
}

export default Login;
