import React from 'react';
import playStore from '../../../images/playstore.png';
import appStore from '../../../images/Appstore.png';
import './Footer.css';


const Footer = ()=>{
    return(
    <footer id = "footer">
        <div className="leftFooter">
            <h4>Download Our APP</h4>
            <p>Download our app for android and iOS.</p>
            <img src={playStore} alt="playstore" />
            <img src={appStore} alt="appstore" />
        </div>

        <div className="midFooter">
            <h1>Ecommerce</h1>
            <p>High quality is our first priority.</p>
            <p>Copyrights 2023 &copy; Uday Tripathi</p>
        </div>

        <div className="rightFooter">
            <h4>Follow us.</h4>
            <a href="www.instagram.com">Instagram</a>
            <a href="www.youtube.com">Youtube</a>
            <a href="www.twitter.com">Twitter</a>
        </div>
    </footer>
    ) 
}

export default Footer;