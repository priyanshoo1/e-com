import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./OrderDetails.css";
import { useAlert } from "react-alert";
import MetaData from "../layout/metadata";
import { Link, useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { orderDetails, clearErrors } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { orderReducer } from "../../reducers/orderReducer";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { id } = useParams();

  const { order, error, loading } = useSelector((state) => state.orderDetails);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(orderDetails(id));
  }, [dispatch, alert, error, id]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Order Details" />
          <div className="orderDetailsPage">
            <div className="orderDetailsContainer">
              <Typography component="h1">
                Order #{order && order._id}
              </Typography>
              <Typography>Shipping Info</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p>Name:</p>
                  <span>{order.user && order.user.name}</span>
                </div>
                <div>
                  <p>Phone:</p>
                  <span>
                    {order.shippingInfo && order.shippingInfo.phoneNo}
                  </span>
                </div>
                <div>
                  <p>Address:</p>
                  <span>
                    {order.shippingInfo &&
                      `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.country}`}
                  </span>
                </div>
              </div>
              <Typography>Payment</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    className={
                      order.paymentInfo &&
                      order.paymentInfo.status === "succeeded"
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    {order.paymentInfo &&
                    order.paymentInfo.status === "succeeded"
                      ? "Paid"
                      : "Unpaid"}
                  </p>
                </div>
                <div>
                  <p>Amount:</p>
                  <span>&#8377;{order.totalPrice && order.totalPrice}</span>
                </div>
              </div>
              <Typography>Order Status</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                    <p className = {order.orderStatus && order.orderStatus === 'Delivered'?"greenColor":"redColor"}>
                       {order.orderStatus && order.orderStatus === 'Delivered'?"Delivered":"Processing"} 
                    </p>
                </div>
              </div>
              <div className="orderDetailsCartItems">
                <Typography>Order Items:</Typography>
                <div className="orderDetailsCartItemsContainer">
                    {order.orderItems && order.orderItems.map((item)=>(
                        <div key = {item.product}>
                            <img src={item.image} alt="Product" />
                            <Link to = {`/product/${item.product}`}>{item.name}</Link>
                            <span>
                                {item.quantity}X{item.price} = <b>&#8377;{item.price*item.quantity}</b>
                            </span>
                        </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </>
  );
};

export default OrderDetails;
