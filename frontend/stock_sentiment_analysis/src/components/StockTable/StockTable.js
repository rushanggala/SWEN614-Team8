import React from 'react';
import './StockTable.css';
import {Table, TableBody, TableRow, TableCell, TableContainer} from '@mui/material';
import {Grid} from "@mui/material";

const StockTable = ({companyData}) => {
    const formatMarketCap = (value) => {
        if (value >= 1e12) {
            return `${(value / 1e12).toFixed(1)} trillion`;
        } else if (value >= 1e9) {
            return `${(value / 1e9).toFixed(1)} billion`;
        } else if (value >= 1e6) {
            return `${(value / 1e6).toFixed(1)} million`;
        } else {
            return value.toString();
        }
    };

    return (
        <div className="stock-table-section">
            <h1>{companyData.longName}</h1>
            <div className="stock-table-container">
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>Long Name:</TableCell>
                                        <TableCell><strong>{companyData.longName}</strong></TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>Open:</TableCell>
                                        <TableCell><strong>{companyData.open}</strong></TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>Symbol:</TableCell>
                                        <TableCell><strong>{companyData.symbol}</strong></TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>Bid:</TableCell>
                                        <TableCell><strong>{companyData.bid} x {companyData.bidSize}</strong></TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>Industry:</TableCell>
                                        <TableCell><strong>{companyData.industry}</strong></TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>Ask:</TableCell>
                                        <TableCell><strong>{companyData.ask} x {companyData.askSize}</strong></TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>Days Range:</TableCell>
                                        <TableCell><strong>{companyData.dayLow} - {companyData.dayHigh}</strong></TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>52 Week Range:</TableCell>
                                        <TableCell><strong>{companyData.fiftyTwoWeekLow} - {companyData.fiftyTwoWeekHigh}</strong></TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>Ex-Dividend Date:</TableCell>
                                        <TableCell><strong>{new Date(companyData.exDividendDate * 1000).toLocaleDateString()}</strong></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                        </TableContainer>
                    </Grid>
                    <Grid item xs={6}>
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>Volume:</TableCell>
                                        <TableCell><strong>{companyData.volume}</strong></TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>Avg Volume:</TableCell>
                                        <TableCell><strong>{companyData.averageVolume}</strong></TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>Market Cap:</TableCell>
                                        <TableCell><strong>${formatMarketCap(companyData.marketCap)}</strong></TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>Beta (5Y Monthly):</TableCell>
                                        <TableCell><strong>{companyData.beta}</strong></TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>PE Ratio (TTM):</TableCell>
                                        <TableCell><strong>{companyData.trailingPE}</strong></TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>EPS (TTM):</TableCell>
                                        <TableCell><strong>{companyData.trailingEps}</strong></TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>Earnings Date:</TableCell>
                                        <TableCell><strong>{companyData.earningsDate}</strong></TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>Forward Dividend & Yield:</TableCell>
                                        <TableCell><strong>{companyData.dividendRate} ({(companyData.dividendYield * 100).toFixed(2)}%)</strong></TableCell>
                                    </TableRow>
                                    <TableRow style={{backgroundColor: 'transparent'}}>
                                        <TableCell>1y Target Est:</TableCell>
                                        <TableCell><strong>{companyData.twoHundredDayAverage}</strong></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                        </TableContainer>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default StockTable;
