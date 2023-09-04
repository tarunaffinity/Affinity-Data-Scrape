const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://affinity.ad/news';
const websiteDomain = 'https://affinity.ad';

async function scrapeAndSaveArticles() {
    console.log("Function ignited!");
  try {
    //Data Fetch
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const articles = [];

    //Use Cheerio to scrape
    $('.ContentCard.ContentCard--NewsLink').each((index, element) => {
     console.log("Loop entered!")
      const title = $(element).find('.ContentCard.ContentCard--NewsLink .ContentCard__link').text().replace(/’|‘|“|” /g, '\'');
      const parts = $(element).find('.ContentCard.ContentCard--NewsLink .ContentCard__tagline').text().split(' - ');
      const date = parts[1];
      const articleUrl = $(element).find('.ContentCard.ContentCard--NewsLink .ContentCard__title a').attr('href');
      const relativeImageUrl = $(element).find('.ContentCard.ContentCard--NewsLink .ContentCard__picture img').attr('src');
      const imageUrl = relativeImageUrl.startsWith('http') ? relativeImageUrl : websiteDomain + relativeImageUrl;
      const publication = parts[0];
      articles.push({ title, date, articleUrl, imageUrl, publication });
      console.log("articles", articles.length);
    });

    //Write File to CSV headers 
    const csvHeader = 'Title,Date,URL,Image URL,Publication\n';

    //Data map throug articles array.
    const csvRows = articles.map(article => 
      `"${article.title}","${article.date}","${article.articleUrl}","${article.imageUrl}","${article.publication}"`
    ).join('\n');
    const csvData = `${csvHeader}${csvRows}`;
    
    //Save CSV file (TODO: May be choose file location)
    fs.writeFileSync('articles.csv', csvData, 'utf8');

    console.log('Articles saved to articles.csv');

  } catch (error) {
    console.error('Error:', error);
  }
}

scrapeAndSaveArticles();

