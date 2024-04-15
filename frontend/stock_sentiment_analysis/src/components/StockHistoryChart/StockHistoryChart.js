import React from 'react';
import {
    CandleSeries,
    Crosshair,
    DateTime,
    Inject,
    LineSeries,
    StockChartComponent,
    StockChartSeriesCollectionDirective,
    StockChartSeriesDirective,
    Tooltip
} from '@syncfusion/ej2-react-charts';
import {
    EmaIndicator,
    RsiIndicator,
    BollingerBands,
    TmaIndicator,
    MomentumIndicator,
    SmaIndicator,
    AtrIndicator,
    AccumulationDistributionIndicator,
    MacdIndicator,
    StochasticIndicator,
    Export
} from '@syncfusion/ej2-react-charts';
import './StockHistoryChart.css'; // Create a CSS file for styling if needed
import {registerLicense} from "@syncfusion/ej2-base";

registerLicense('ORg4AjUWIQA/Gnt2UFhhQlJBfVpdXGZWfFN0QXNedV1zflBFcC0sT3RfQFljTX9WdkJnW39XdXFVRQ==');
const StockHistoryChart = ({stockHistory}) => {
    console.log(stockHistory);
    return (
        <div className="stock-historical-chart">
            <StockChartComponent >
                <StockChartSeriesCollectionDirective>
                    <StockChartSeriesDirective dataSource={stockHistory} type='Candle' xName='Date'
                                                high='High' low='Low' open='Open' close='Close'>
                    </StockChartSeriesDirective>
                </StockChartSeriesCollectionDirective>
                <Inject
                    services={[DateTime, Tooltip, Crosshair, CandleSeries, LineSeries, EmaIndicator, RsiIndicator, BollingerBands, TmaIndicator, MomentumIndicator, SmaIndicator, AtrIndicator, Export, AccumulationDistributionIndicator, MacdIndicator, StochasticIndicator]}/>
            </StockChartComponent>
        </div>
    );
}

export default StockHistoryChart;
