import React,{Fragment} from 'react';
import { useSelector } from 'react-redux';
import {Navigate} from 'react-router-dom';

const ProtectedRoute = ({children}) => {

    const {loading,isAuthenticated} = useSelector(state=>state.user);

    return(!loading && (isAuthenticated === false)?<Navigate to = "/login"/>:(children));
}

export default ProtectedRoute