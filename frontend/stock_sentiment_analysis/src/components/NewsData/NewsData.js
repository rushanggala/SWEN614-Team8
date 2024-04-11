// components/NewsData.js
// import React from 'react';
// import NewsItem from '../NewsItem/NewsItem';
// import TopCompanies from '../TopCompanies/TopCompanies';
// import NewsDataJson from '../../news.json';
// import './NewsData.css';

// const NewsData = () => {
//     const [newsItems] = React.useState(NewsDataJson);
//     const largeNewsItem = newsItems[0];
//     const smallNewsItems = newsItems.slice(1, 4);

//     return (
//         <div className="news-section">
//             <div className="large-news">
//                 <NewsItem news={largeNewsItem} />
//             </div>
//             <div className="small-news">
//                 {smallNewsItems.map((news, index) => (
//                     <NewsItem key={index} news={news} size="small" />
//                 ))}
//             </div>
//             <TopCompanies />
//         </div>
//     );
// };

// export default NewsData;
// components/NewsData.js
import React, { useEffect, useState } from 'react';
import NewsItem from '../NewsItem/NewsItem';
import TopCompanies from '../TopCompanies/TopCompanies';
import NewsDataJson from '../../news.json';
import './NewsData.css';

const NewsData = () => {
    const [shuffledNewsItems, setShuffledNewsItems] = useState([]);

    const shuffleNewsItems = (newsItems) => {
        let currentIndex = newsItems.length, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [newsItems[currentIndex], newsItems[randomIndex]] = [
            newsItems[randomIndex], newsItems[currentIndex]];
        }

        return newsItems;
    };

    useEffect(() => {

        const shuffleAndSetNewsItems = () => {
            setShuffledNewsItems(shuffleNewsItems([...NewsDataJson]));
        };

        shuffleAndSetNewsItems();

        const intervalId = setInterval(shuffleAndSetNewsItems, 4000);

        return () => clearInterval(intervalId);
    }, []);

    const largeNewsItem = shuffledNewsItems[0];
    const smallNewsItems = shuffledNewsItems.slice(1, 3);

    return (
        <div className="news-section">
            <div className="large-news">
                {largeNewsItem && <NewsItem news={largeNewsItem} />}
            </div>
            <div className="small-news">
                {smallNewsItems.map((news, index) => (
                    <NewsItem key={index} news={news} size="small" />
                ))}
            </div>
            <TopCompanies />
        </div>
    );
};

export default NewsData;