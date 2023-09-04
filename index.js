const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const app = express();
const port = 3000;
const url = 'https://affinity.ad/news';

app.set('view engine', 'ejs');

app.get('/scrape', (req, res) => {
    axios.get(url).then(response => {
        const $ = cheerio.load(response.data);
        console.log(response.data);
        const articles = [];

        $('.ElementNewsLinksGrid__item').each((index, element) => {
        
            //Custom Data
            const title = $(element).find('.ElementNewsLinksGrid__item a').text();

            articles.push({title});
            
        });

        res.render('index', {articles});

    }).catch(error => {
        console.error("Error: ", error);
        res.status(500).send(error.toString());
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
