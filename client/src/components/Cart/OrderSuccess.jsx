import React,{Fragment,useEffect} from 'react'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import './OrderSuccess.css';
import { Typography } from '@material-ui/core';
import {Link} from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';
import {myOrders,clearErrors} from '../../actions/orderAction';
import {useAlert} from 'react-alert';

const OrderSuccess = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const {error} = useSelector(state=>state.myOrders);

    useEffect(() => {
      if(error){
        alert.error(error);
        dispatch(clearErrors());
      }

      dispatch(myOrders());
      
    }, [error,dispatch,alert]);
    
  return (
    <Fragment>
        <div className="orderSuccess">
            <CheckCircleIcon/>
            <Typography>Your order has been placed.</Typography>
            <Link to = "/orders">View Orders</Link>
        </div>
    </Fragment>
  )
}

export default OrderSuccess