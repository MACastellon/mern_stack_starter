import React, {useContext, useEffect, useState} from 'react';
import {Route, Redirect} from 'react-router-dom'
import {AuthContext} from "../../contexts/AuthContext/AuthContext";
import axios from "axios";
import {useHistory} from 'react-router-dom';

const PrivateRoute = ({path, component}) => {

    const {user, token ,logout} = useContext(AuthContext);
    const [loading, setLoading] = useState(true)
    const [isValidToken, setIsValidToken] = useState(false)
    const history = useHistory();

    // Verify if the token is still valid
    useEffect(async () => {

        const config = {
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        }
        axios.post("http://localhost:5000/users/verify", null, config)
            .then(res => {
                const success = res.data.success
                console.log(success)
                if (success) {
                    setIsValidToken(true);
                    setLoading(false)
                } else {
                    setLoading(false)
                    logout();
                }

            })
            .catch(err => console.log(err));
    }, [history.location.pathname]);

    const displayRoute  = () => {
        if (isValidToken && user !== null) {
            return  <Route path={path} component={component}/>
        } else {
            return <Redirect to={"/"}/>
        }
    };

    return (
        <>
            {!loading ? (displayRoute()) : (null)}
        </>
    )
}

export default PrivateRoute;