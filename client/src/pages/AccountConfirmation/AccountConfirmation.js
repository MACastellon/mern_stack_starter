import React, {useEffect} from 'react';
import axios from 'axios';

const AccountConfirmation = (props) => {
    const token = props.match.params.token;
    const ACCOUNT_CONFIRMATION_URL = `http://localhost:5000/users/confirmation/${token}`;

    useEffect(() => {
        axios.post(ACCOUNT_CONFIRMATION_URL)
            .then(res => console.log(res))
            .catch(e => console.log(e));
    },[])

    return (
        <>
          <h3>Confirmation page</h3>
            {console.log(token)}
        </>
    )
}

export default AccountConfirmation;