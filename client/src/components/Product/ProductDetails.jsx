import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails } from "../../actions/productAction";
import ReviewCard from "./ReviewCard.jsx";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import MetaData from "../layout/metadata";
import { addItemsToCart } from "../../actions/cartAction";
import {newReview} from '../../actions/productAction';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import {Rating} from '@material-ui/lab';
import { NEW_REVIEW_RESET } from "../../constants/productConstants";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const {success,error:reviewError} = useSelector((state)=>state.newReview);
  const alert = useAlert();

  const options = {
    size: "large",
    value: product.ratings,
    readOnly: true,
    precision:0.5
  };

  const [quantity, setQuantity] = useState(1);
  const [open,setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const increaseQuantity = () => {
    if (product.stocks <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    alert.success("Item added to cart successfully.");
  };

  const submitReviewToggle = ()=>{
    open?setOpen(false):setOpen(true);
  }

  const reviewSubmitHandler = ()=>{
    const myForm = new FormData();

    myForm.set("rating",rating);
    myForm.set("comment",comment);
    myForm.set("productId",id);
    
    dispatch(newReview(myForm));
    setOpen(false);
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }

    if(success){
        alert.success("Review Submitted Successfully!");
        dispatch({type:NEW_REVIEW_RESET})
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, error, alert,success,reviewError]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} -- ECOMMERCE`} />
          <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={item.url}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>
            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product# {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className = "detailsBlock-2-span">({product.numOfReviews} Reviews)</span>
              </div>
              <div className="detailsBlock-3">
                <h1>&#8377;{`${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                  </div>{" "}
                  <button
                    disabled={product.stock < 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    {product.stock < 1 ? "Out of Stock" : "Add to Cart."}
                  </button>
                </div>
                <p>
                  Status:{" "}
                  <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                    {product.stock < 1 ? "Out of Stock" : "In Stock"}
                  </b>
                </p>
              </div>
              <div className="detailsBlock-4">
                Description: <p>{product.description}</p>
              </div>
              <button onClick = {submitReviewToggle} className="submitReview">Submit Review.</button>
            </div>
          </div>
          <h3 className="ReviewsHeading">Reviews</h3>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                {...options}
              />
              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <DialogActions>
                <Button onClick={submitReviewToggle} color ="secondary">Cancel</Button>
                <Button onClick = {reviewSubmitHandler}>Submit</Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
