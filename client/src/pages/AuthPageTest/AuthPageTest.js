import React, {useContext} from 'react';
import {AuthContext} from "../../contexts/AuthContext/AuthContext";
import {Link} from "react-router-dom";

const AuthPageTest = () => {
    const {user} = useContext(AuthContext);
    return (
        <>
            <h2>Welcome {`${user.firstName} ${user.lastName}`}</h2>
            <Link to={"/"}>Go HOME</Link>
        </>
    )
}
export default AuthPageTest;