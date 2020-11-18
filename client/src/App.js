import React, {useContext} from "react";
import {Route, Switch, Redirect} from 'react-router-dom'
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import {AuthProvider} from "./contexts/AuthContext/AuthContext";
import Home from "./pages/Home/Home";
import AccountConfirmation from "./pages/AccountConfirmation/AccountConfirmation";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import RedirectedRoute from "./components/RedirectedRoute/RedirectedRoute";
import AuthPageTest from "./pages/AuthPageTest/AuthPageTest";
import {AuthContext} from "./contexts/AuthContext/AuthContext";
import NotFound from "./pages/NotFound/NotFound";

const App = () => {
    const {loading} = useContext(AuthContext);
    return (
        <>
            {!loading ? (
                <Switch>
                    <RedirectedRoute path={'/register'} component={Register}/>
                    <RedirectedRoute path={'/login'} component={Login}/>
                    <Route exact path={'/verify/:token'} component={AccountConfirmation}/>
                    <PrivateRoute exact path={'/authpagetest'} component={AuthPageTest}/>
                    <Route exact path={'/'} component={Home}/>
                    <Route component={NotFound}/>
                </Switch>
            ) : (
                null
            )}
        </>

    )
}

export default App;
