import React, {useContext} from 'react';
import {Route,Redirect} from 'react-router-dom';
import {AuthContext} from "../../contexts/AuthContext/AuthContext";

const RedirectedRoute = ({path,component}) => {
    const {user} = useContext(AuthContext);
    return (
        <>
            {!user ? (
                <Route exact path={path} component={component}/>
                ) : (
                    <Redirect to={'/'}/>
                )}
        </>
    )
}
export default RedirectedRoute;