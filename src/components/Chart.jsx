import React, { useEffect, useRef, memo } from 'react';
import '../App.css';

/**
 * TradingView Advanced Chart embedded in its own iframe so
 * cross-origin errors won't bubble into React dev overlay.
 */
const TradingViewWidget = ({ selectedToken = "sol", maCount = 5, interval = 1 }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Validate inputs
    const validMaCount = Math.max(1, Math.min(parseInt(maCount) || 5, 1000));
    const validInterval = Math.max(1, Math.min(parseInt(interval) || 1, 1440));

    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.setAttribute('frameBorder', '0');

    const symbol = `BINANCE:${selectedToken.toUpperCase()}USDT`;

    const widgetConfig = JSON.stringify({
      "allow_symbol_change": true,
      "calendar": false,
      "details": false,
      "hide_side_toolbar": true,
      "hide_top_toolbar": false,
      "hide_legend": false,
      "hide_volume": true,
      "hotlist": false,
      "interval": validInterval.toString(),
      "locale": "en",
      "save_image": true,
      "style": "1",
      "symbol": symbol,
      "theme": "light",
      "timezone": "Etc/UTC",
      "backgroundColor": "#FFFFFF",
      "gridColor": "rgba(0, 0, 0, 0.3)",
      "watchlist": [],
      "withdateranges": false,
      "compareSymbols": [],
      "studies": [
        {
          "id": "MASimple@tv-basicstudies",
          "inputs": {
            "length": validMaCount,
            "source": "close"
          }
        },
        {
          "id": "MASimple@tv-basicstudies",
          "inputs": {
            "length": 50,
            "source": "close"
          }
        },
        {
          "id": "RSI@tv-basicstudies",
          "inputs": {
            "length": 14,
            "source": "close"
          }
        }
      ],
      "autosize": true
    });

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            html, body { height: 100%; margin: 0; background: #0F0F0F; }
            .tradingview-widget-container { height: 100%; width: 100%; }
            .tradingview-widget-container__widget { height: 100%; width: 100%; }
          </style>
        </head>
        <body>
          <div class="tradingview-widget-container">
            <div class="tradingview-widget-container__widget"></div>
            <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js" async>
              ${widgetConfig}
            </script>
          </div>
        </body>
      </html>
    `;

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      doc.open();
      doc.write(html);
      doc.close();
    } catch (error) {
      console.error('Error creating TradingView widget:', error);
    }

    return () => {
      try {
        const d = iframe.contentDocument || iframe.contentWindow?.document;
        if (d) {
          d.open();
          d.write('<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#0F0F0F"></body></html>');
          d.close();
        }
      } catch { }
    };
  }, [selectedToken, maCount, interval]);

  return (
    <div className="chart-box">
      <iframe
        key={`${selectedToken}-${maCount}-${interval}`}
        ref={iframeRef}
        title="TradingView SOLUSDT"
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}

export default memo(TradingViewWidget);
