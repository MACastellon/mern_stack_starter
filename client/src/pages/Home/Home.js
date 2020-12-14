import React, {useContext} from 'react';
import {NavLink} from "react-router-dom";
import {AuthContext} from "../../contexts/AuthContext/AuthContext";

const Home = () => {
    const {user,logout} = useContext(AuthContext);
    return (
        <>
            <h1>Home Components</h1>
            <NavLink to={'/login'}>Login</NavLink>
            <NavLink to={'/register'}>register</NavLink>
            <NavLink to={'/authpagetest'}>authtest</NavLink>
            {user != null ? (        <button onClick={() => logout()}> logout</button>) : (null)}

        </>
    )
}

export default Home;