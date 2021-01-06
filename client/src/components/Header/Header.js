import React, {useContext} from 'react';
import {NavLink} from "react-router-dom";
import {AuthContext} from "../../contexts/AuthContext/AuthContext";

const Header = () => {

    const {user,logout} = useContext(AuthContext);

    return (
        <>
            <NavLink to={'/login'}>Login</NavLink>
            <NavLink to={'/register'}>register</NavLink>
            <NavLink to={'/authpagetest'}>authtest</NavLink>
            {user != null ? (<NavLink to={'/users/reset_password'}>Reset password</NavLink>) : (null)}
            {user != null ? (<button onClick={() => logout()}> logout</button>) : (null)}
        </>
    )
}
export default Header;