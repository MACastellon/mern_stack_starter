import React, {useContext} from 'react';
import {Route, Redirect} from 'react-router-dom'
import {AuthContext} from "../../contexts/AuthContext/AuthContext";

const PrivateRoute = ({path, component}) => {

    const {user} = useContext(AuthContext);
    return (
       <>
           {user !== null ? (
                <Route path={path} component={component}/>
           ) : (
               <Redirect to={'/login'}/>
           )}
       </>
    )
}

export default PrivateRoute;