import React, {useState, createContext ,useEffect} from 'react';
import jwtDecode from "jwt-decode";
import axios from 'axios';

export const AuthContext = createContext();

export const  AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token , setToken] = useState(null);

    useEffect(async ()  => {

        if (!localStorage.getItem("token")) {
            setLoading(false);
            return
        }

        try {
            const token = JSON.parse(localStorage.getItem("token"))

            const isValidToken = await  axios.post("http://localhost:5000/users/verify", {token: token})
                .then(res => {
                    const success = res.data.success
                    if (success) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .catch(err => console.log(err));

            if (isValidToken) {
                const decodedToken = await jwtDecode(token);
                setUser(decodedToken);
                setToken(token);
                setLoading(false);
            } else {
                logout();
                setLoading(false)
            }
        } catch (e) {
            console.log(e);
            localStorage.removeItem('token');
        }

    },[])

    const login = async (token) => {

        const decodedToken = await jwtDecode(token);
        await setUser(decodedToken);
        await setToken(token);
        localStorage.setItem("token",JSON.stringify(token));

    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('token');
    }


    const value = {user,token , loading ,login, logout};

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}


