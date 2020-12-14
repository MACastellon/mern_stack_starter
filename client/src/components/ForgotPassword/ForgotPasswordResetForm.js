import React, {useState} from 'react';
import axios from 'axios';

const ForgotPasswordResetForm = (props) => {
    const email = props.email;
    const token =  props.token;
    const [password,setPassword] = useState('')
    const [password2,setPassword2] = useState('')
    const FORGOT_PASSWORD_RESET_URL = `http://localhost:5000/users/forgot_password/reset`;


    const submitHandler = (e) => {
        e.preventDefault();
        let formData = {
            email: email,
            password : password,
            password2 : password2,
            token : token
        }
        axios.post(FORGOT_PASSWORD_RESET_URL, formData)
            .then((res) => {
                console.log(res.data);
            })
    }
    return (
        <>
            <h1>ForgotPasswordReset</h1>

            <form onSubmit={(e) => submitHandler(e)} action="POST">
                <div>
                    New password
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div>
                    Confirm new password
                    <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)}/>
                </div>
                <input type="submit"/>

            </form>
        </>
    )
}
export default ForgotPasswordResetForm;