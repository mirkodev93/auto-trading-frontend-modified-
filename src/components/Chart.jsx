import React, { memo } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import '../App.css';

/**
 * TradingView Advanced Chart using react-ts-tradingview-widgets
 */
const TradingViewWidget = ({ selectedToken = "sol", maCount = 5, interval = 1 }) => {
  // Validate inputs
  const validMaCount = Math.max(1, Math.min(parseInt(maCount) || 5, 1000));
  const validInterval = Math.max(1, Math.min(parseInt(interval) || 1, 1440));

  const symbol = `BINANCE:${selectedToken.toUpperCase()}USDT`;

  const widgetProps = {
    allow_symbol_change: true,
    calendar: false,
    details: false,
    hide_side_toolbar: true,
    hide_top_toolbar: false,
    hide_legend: false,
    hide_volume: true,
    hotlist: false,
    interval: validInterval.toString(),
    locale: "en",
    save_image: true,
    style: "1",
    symbol: symbol,
    theme: "light",
    timezone: "Etc/UTC",
    backgroundColor: "#FFFFFF",
    gridColor: "rgba(0, 0, 0, 0.3)",
    watchlist: [],
    withdateranges: false,
    compareSymbols: [],
    studies: [
      {
        id: "MASimple@tv-basicstudies",
        inputs: {
          length: validMaCount,
          source: "close"
        }
      },
      {
        id: "MASimple@tv-basicstudies",
        inputs: {
          length: 50,
          source: "high"
        }
      },
      {
        id: "RSI@tv-basicstudies",
        inputs: {
          length: 14,
          source: "close"
        }
      }
    ],
    autosize: true,
    width: "100%",
    height: "100%"
  };

  return (
    <div className="chart-box">
      <AdvancedRealTimeChart
        key={`${selectedToken}-${maCount}-${interval}`}
        {...widgetProps}
      />
    </div>
  );
}

export default memo(TradingViewWidget);
