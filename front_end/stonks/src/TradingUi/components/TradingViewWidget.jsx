import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget({ symbol }) {
  const container = useRef();

  useEffect(() => {
    const loadWidget = () => {
      if (container.current) {
        container.current.innerHTML = ''; // Clear previous chart
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = JSON.stringify({
          "width": "900",
          "height": "610",
          "symbol": symbol,
          "interval": "1D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "hide_side_toolbar": true,
          "allow_symbol_change": false,
          "calendar": true,
          "support_host": ""
        });
        container.current.appendChild(script);
      }
    };

    loadWidget(); // Widget load or reload on symbol change
  }, [symbol]); // Re-run effect when 'symbol' changes

  return (
    <div className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget" ref={container}></div>
    </div>
  );
}

export default memo(TradingViewWidget);
