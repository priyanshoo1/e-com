import {
  ORDER_REQUEST,
  ORDER_FAIL,
  ORDER_SUCCESS,
  CLEAR_ERRORS,
  MY_ORDERS_REQUEST,
  MY_ORDERS_FAIL,
  MY_ORDERS_SUCCESS,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_SUCCESS
} from "../constants/orderConstants";
import axios from "axios";


// Create Order
export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({
      type: ORDER_REQUEST,
    });

    const config = {
      headers: {
        "content-type": "application/json",
      },
    };

    const { data } = await axios.post(`/api/v1/order/new`, order, config);

    dispatch({
      type: ORDER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_FAIL,
      payload: error.response.data.error,
    });
  }
};


// My Order
export const myOrders = () => async (dispatch) => {
    try {
      dispatch({
        type: MY_ORDERS_REQUEST,
      });
      
      const { data } = await axios.get(`/api/v1/orders/me`);

      console.log(data.orders);
  
      dispatch({
        type: MY_ORDERS_SUCCESS,
        payload: data.orders,
      });
    } catch (error) {
      dispatch({
        type: MY_ORDERS_FAIL,
        payload: error.response.data.error,
      });
    }
  };

  // Order Details
export const orderDetails = (id) => async (dispatch) => {
  try {
    dispatch({
      type: ORDER_DETAILS_REQUEST,
    });
    
    const { data } = await axios.get(`/api/v1/order/${id}`);

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data.order,
    });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: error.response.data.error,
    });
  }
};
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
