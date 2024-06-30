import React, { Fragment } from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard.jsx";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, removeCartItem } from "../../actions/cartAction";
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import { Typography } from "@material-ui/core";
import {Link,useNavigate} from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);

  const deleteCartItem = (id) => {
    dispatch(removeCartItem(id));
  };

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (quantity >= stock) {
      return;
    }

    dispatch(addItemsToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;

    if (quantity > 1) dispatch(addItemsToCart(id, newQty));
    if (quantity === 1) {
      deleteCartItem(id);
    }
    return;
  };

  const checkoutHandler = ()=>{
    navigate('/login?redirect=shipping');
  }

  return (
    <>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon/>
          <Typography>Nothing to show</Typography>
          <Link to = "/products">Shop Now</Link>
        </div>
      ) : (
        <Fragment>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>
            {cartItems &&
              cartItems.map((item) => (
                <div className="cartContainer" key={item.product}>
                  <CartItemCard item={item} deleteCard={deleteCartItem} />
                  <div className="cartInput">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.product, item.quantity)
                      }
                    >
                      -
                    </button>
                    <input type="number" value={item.quantity} readOnly />
                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.product,
                          item.quantity,
                          item.stock
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="cartSubtotal">
                    &#8377;{item.price * item.quantity}
                  </p>
                </div>
              ))}
            <div className="cartGrossProfit">
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Gross Total</p>
                <p>&#8377;{`${cartItems.reduce(
                  (acc,item)=>acc + item.price*item.quantity,0
                )}`}</p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick = {checkoutHandler}>Check Out</button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </>
  );
};

export default Cart;
