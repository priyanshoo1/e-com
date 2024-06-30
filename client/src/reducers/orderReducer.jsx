import {
  ORDER_REQUEST,
  ORDER_FAIL,
  ORDER_SUCCESS,
  CLEAR_ERRORS,
  MY_ORDERS_REQUEST,
  MY_ORDERS_FAIL,
  MY_ORDERS_SUCCESS,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL
  
} from "../constants/orderConstants";

export const orderReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ORDER_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };
    case ORDER_FAIL:
      return {
        loading: true,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const myOrdersReducer = (state = {orders:[]}, action) => {
    switch (action.type) {
      case MY_ORDERS_REQUEST:
        return {
          loading: true,
        };
      case MY_ORDERS_SUCCESS:
        return {
          loading: false,
          orders: action.payload,
        };
      case MY_ORDERS_FAIL:
        return {
          loading: true,
          error: action.payload,
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };

  export const orderDetailsReducer = (state = {order:{}}, action) => {
    switch (action.type) {
      case ORDER_DETAILS_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case ORDER_DETAILS_SUCCESS:
        return {
          loading: false,
          order: action.payload,
        };
      case ORDER_DETAILS_FAIL:
        return {
          loading: true,
          error: action.payload,
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };