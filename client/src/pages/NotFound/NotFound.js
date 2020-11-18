import React from 'react';
import {Link} from "react-router-dom";

const NotFound = () => {
    return(
        <>
            <h2>404 not found</h2>
            <Link to={'/'}>return home</Link>
        </>
    )
}
export  default NotFound;