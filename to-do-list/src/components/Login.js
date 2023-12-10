import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

function Login({ setIsLoggedIn }) {
    return (
        <div>
            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    console.log(credentialResponse);
                    setIsLoggedIn(true);
                }}
                onError={() => {
                    console.log('Login Failed!');
                }}
            />
        </div>
    );
}

export default Login;
