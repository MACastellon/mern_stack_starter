import React, {useContext} from 'react';
import {AuthContext} from "../../contexts/AuthContext/AuthContext";

const AuthPageTest = () => {
    const {user} = useContext(AuthContext);
    return (
        <>
            <h2>Welcome {`${user.firstName} ${user.lastName}`}</h2>

        </>
    )
}
export default AuthPageTest;