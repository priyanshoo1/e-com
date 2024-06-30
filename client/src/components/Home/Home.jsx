import React, { Fragment,useEffect } from 'react';
import {CgMouse} from 'react-icons/cg';
import './Home.css';
import ProductCard from './ProductCard.jsx';
import MetaData from '../layout/metadata';
import {clearErrors, getProducts} from '../../actions/productAction';
import {useSelector,useDispatch} from 'react-redux';
import Loader from '../layout/Loader/Loader';
import {useAlert} from 'react-alert';


const Home = ()=>{

    const alert = useAlert();
    const dispatch = useDispatch();

    const {loading,error,products,productCount,filteredProductCount} = useSelector(state=>state.products);

    useEffect(()=>{
        if(error){
            console.log(error);
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProducts());
    },[dispatch,error,alert]);

    return(
        <Fragment>
            {loading?(<Loader/>):(
                <Fragment>
                <MetaData title = "Home Page"/>
                <div className="banner">
                    <p>Welcome to E-commerce.</p>
                    <h1>FIND AMAZING PRODUCTS BELOW.</h1> 
    
                    <a href="#container">
                        <button>
                            scroll <CgMouse/>
                        </button>
                    </a> 
                </div>
                <h2 className = "homeHeading">
                    Featured Products.
                </h2>
                <div className="container" id = "container">
    
                    {products && products.map(product=>(
                        <ProductCard product = {product}/>
                    ))}
                   
                </div>
            </Fragment>
            )}
        </Fragment>
    )
}

export default Home;