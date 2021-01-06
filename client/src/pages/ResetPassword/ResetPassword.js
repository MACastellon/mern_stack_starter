import React, {useContext,useState} from 'react';
import axios from 'axios';
import {AuthContext} from "../../contexts/AuthContext/AuthContext";
import {useHistory} from 'react-router-dom';

const ResetPassword = () => {
    const {user} = useContext(AuthContext);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const history = useHistory();
    const RESET_PASSWORD_URL = 'http://localhost:5000/users/reset_password';

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = {
            _id : user._id,
            currentPassword,
            newPassword,
            newPassword2
        }
        axios.put(RESET_PASSWORD_URL, formData)
            .then((res) => {
                const success = res.data.success;
                if (success) {

                }

            })
            .catch(e => console.log(e));
    }

    return (
        <>
            <form action="PUT" onSubmit={(e) =>submitHandler(e)}>
                <label>Current password</label>
                <input type="password" placeholder={"current password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
                <label>New password</label>
                <input type="password" placeholder={"New password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                <label>Confirm new password</label>
                <input type="password" placeholder={"Confirm new password"} value={newPassword2} onChange={(e) => setNewPassword2(e.target.value)}/>
                <input type="submit"/>
            </form>
        </>
    );
}

export default ResetPassword;