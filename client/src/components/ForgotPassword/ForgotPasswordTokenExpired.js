import React from 'react';
import axios from 'axios';

const ForgotPasswordTokenExpired = (props) => {
    const email = props.email;
    return (
        <>
            <h1>Your token has expired ... {email} </h1>
            <button>Forgot password</button>
        </>
    )
}
export default ForgotPasswordTokenExpired;