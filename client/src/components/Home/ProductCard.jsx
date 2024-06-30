import React from 'react';
import {Link} from 'react-router-dom';
import {Rating} from '@material-ui/lab';

const ProductCard = ({product,link})=>{
    const options = {
        size: "large",
        value: product.ratings,
        readOnly: true,
        precision:0.5
      };
    return(
        <Link className = "productCard" to ={`/product/${product._id}`}>
            <img src={product.images[0].url} alt  = "Product"/>
            <p>{product.name}</p>
            <div>
                <Rating {...options} />
                <span className = "productCardSpan">({product.reviews.length} Reviews)</span>
            </div>
            <span>&#8377;{product.price}</span>
        </Link>
    );
};

export default ProductCard;