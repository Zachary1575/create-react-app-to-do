import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Login from './components/Login';
import TodoList from './components/Todo';

import './App.css';

const clientId = "896511146416-4u6ah1l6342v8rddaiq60kgbi2o6qjdc.apps.googleusercontent.com";

function App() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [token, setToken] = React.useState("")

    React.useEffect(() => {}, [isLoggedIn])

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <Router>
                <Routes>
                    <Route path="/login" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} setToken={setToken} /> : <TodoList Token={token} />} />
                    <Route path="/" element={isLoggedIn ? <TodoList Token={token} /> : <Login setIsLoggedIn={setIsLoggedIn} setToken={setToken} />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;



