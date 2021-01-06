import React, {useState, useContext} from 'react';
import axios from 'axios'
import {useHistory} from 'react-router-dom';
import {AuthContext} from "../../contexts/AuthContext/AuthContext";

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState("");
    const {login} = useContext(AuthContext);
    const history = useHistory();

    const submitHandler = (e) => {
        e.preventDefault()

        const formData = {
            email : email,
            password : password
        }

        console.log(formData)

        axios.post("http://localhost:5000/users/login",formData,)
            .then(async (res) => {
                if (res.data.success) {
                     await login(res.data.token);
                    history.push('/authpagetest')
                } else {
                    setMessage(res.data.message);
                }

            })
            .catch(e => {
                console.log(e)
            })
    }
    return (
        <>
            <h2>Login page</h2>
            <form action="POST" onSubmit={(e) => submitHandler(e)}>
                <div>
                    <label>Email</label>
                    <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div>
                    <label>Password</label>
                    <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <input type="submit"/>
            </form>
        </>
    )
}

export default Login;