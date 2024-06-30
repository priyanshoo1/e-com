import React from 'react';
import './CartItemCard.css';
import {Link} from 'react-router-dom';

const CartItemCard = ({item,deleteCard}) => {


  return (
    <div className="CartItemCard">
      <img src={item.image} alt="image" />
      <div>
        <Link to = {`products/${item.product}`}>{item.name}</Link>
        <span>{`Price: `}&#8377;{` ${item.price}`}</span>
        <p onClick = {()=>deleteCard(item.product)}>Remove</p>
      </div>
    </div>
  )
}

export default CartItemCard