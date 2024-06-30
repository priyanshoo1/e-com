import React, { Fragment } from "react";
import CheckOutSteps from "./CheckOutSteps";
import { useSelector } from "react-redux";
import MetaData from "../layout/metadata";
import "./ConfirmOrder.css";
import { Link,useNavigate } from "react-router-dom";
import { Typography } from "@material-ui/core";

const ConfirmOrder = () => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const totalPrice = subtotal + shippingCharges + tax;
  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country} (${shippingInfo.pincode})`;

  const proceedToPayment = ()=>{
    const data = {
        subtotal,
        shippingCharges,
        tax,
        totalPrice
    };

    sessionStorage.setItem("orderInfo",JSON.stringify(data));
    navigate('/process/payment');
  }
  
  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <CheckOutSteps activeSteps={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{user.name}</span>
              </div>
              <div>
                <p>Contact No:</p>
                <span>{shippingInfo.phone}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="Product" />
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                    <span>
                      <pre>
                        {item.quantity} X {item.price} ={" "}
                        <b>&#8377;{item.quantity * item.price}</b>
                      </pre>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div>
          <div className="orderSummary">
            <Typography>Order Summary</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>&#8377;{subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>&#8377;{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>&#8377;{tax}</span>
              </div>
            </div>
            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>{totalPrice}</span>
            </div>
            <button onClick = {proceedToPayment}>Proceed To Payment...</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
