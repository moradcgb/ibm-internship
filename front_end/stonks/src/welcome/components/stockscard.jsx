import React, { useEffect } from "react";
import './stockscard.css';
import { useNavigate } from "react-router-dom"; // Correct hook usage

const Stockscard = () => {
    const navigate = useNavigate(); // Use the navigate function correctly

    const handleClick = () => {
        navigate('/trade'); // Navigate to the /trade route
    }

    useEffect(() => {
        // Create a script element to load the TradingView widget
        const script = document.createElement('script');
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "symbol": "IBM",
            "width": 350,
            "isTransparent": false,
            "colorTheme": "dark",
            "locale": "en"
        });

        // Find the widget container and append the script
        const tradingViewContainer = document.querySelector(".tradingview-widget-container__widget");
        if (tradingViewContainer) {
            tradingViewContainer.appendChild(script);
        }

        // Clean up the effect when the component unmounts
        return () => {
            if (tradingViewContainer) {
                tradingViewContainer.innerHTML = ''; // Remove script content if component unmounts
            }
        };
    }, []);

    return (
        <>
            <div className="tradingview-container">
                <div className="invisiblediv" onClick={handleClick}></div>
                <div className="tradingview-widget-container">
                    <div className="tradingview-widget-container__widget"></div>
                    <div className="tradingview-widget-copyright">
                        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Stockscard;
