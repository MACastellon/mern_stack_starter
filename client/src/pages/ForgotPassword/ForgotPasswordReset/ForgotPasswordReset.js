import React, {useEffect,useState} from 'react';
import {useHistory} from "react-router-dom";
import axios from 'axios';
import jwtDecode from "jwt-decode";
import ForgotPasswordTokenExpired from "../../../components/ForgotPassword/ForgotPasswordTokenExpired";
import ForgotPasswordResetForm from "../../../components/ForgotPassword/ForgotPasswordResetForm";

const ForgotPasswordReset = (props) => {
    const token = props.match.params.token;
    const history = useHistory();

    const [isValidToken, setIsValidToken]= useState(false)
    const [email, setEmail]= useState('')
    const [loading,setLoading] = useState(true);

    const FORGOT_PASSWORD_TOKEN_URL = `http://localhost:5000/users/forgot_password/${token}`;


    useEffect(() => {
        axios.put(FORGOT_PASSWORD_TOKEN_URL)
            .then((res) => {
                const success = res.data.success;
                const expired = res.data.expired;
                const decodedToken = jwtDecode(token);
                if (success) {
                    setIsValidToken(true);
                    setEmail(decodedToken.email);
                    setLoading(false);
                } else if (expired) {
                    setEmail(decodedToken.email);
                    setLoading(false);
                } else {
                    history.push('/');
                }

            })
    }, [])

    const displayComponents = () => {
        if (isValidToken) {
            return <ForgotPasswordResetForm email={email} token={token}/>
        } else {
            return <ForgotPasswordTokenExpired email={email}/>
        }
    }
    return (
        <>
            {!loading ? (
                displayComponents()
            ) : (
                null
            )}
        </>
    )
}

export default ForgotPasswordReset;