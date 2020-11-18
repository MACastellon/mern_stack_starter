import React, {useState,useEffect,useContext} from 'react'
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import {AuthContext} from "../../contexts/AuthContext/AuthContext";

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const REGISTER_URL = 'http://localhost:5000/users/register';

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = {
            firstName : firstName,
            lastName : lastName,
            email : email,
            password : password,
            password2 : password2
        }

        axios.post(REGISTER_URL , formData)
            .then(res => {
                console.log(res.data);
            })

    }
    return (
        <div>
            <h2>Register pages</h2>
            <form action="POST" onSubmit={(e) => submitHandler(e)}>
                <div>
                    <label>First name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                </div>
                <div>
                    <label>Last name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div>
                    <label>password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div>
                    <label>Confirm password</label>
                    <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)}/>
                </div>
                <input type="submit"/>
            </form>
        </div>
    )
}

export default Register;