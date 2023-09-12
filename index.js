const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const sharp = require('sharp');
const { info } = require('console');

const app = express();
const port = 3000;
const url = 'https://affinity.ad/news';


// Define variables for Image_Magic
const backgroundImage = 'images/sample-image.jpg';
const first_name = 'This is a Sample Text';
const last_name = 'This is a Sample Text';
const friends_name = 'This is a Sample Text';
const size = 44;
const f_weight = 700;
const color = '#ffffff';
const gravity = 'center';


// SVG export 
const svg = `
<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <text x="20%" y="30%" font-size="${size}" font-weight="${f_weight}" fill="${color}" text-anchor="middle" alignment-baseline="middle">${first_name} ${last_name} </text>
  <text x="20%" y="50%" font-size="${size}" font-weight="${f_weight}" fill="${color}" text-anchor="middle" alignment-baseline="middle">${first_name} ${last_name} </text>
</svg>`;



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


app.get('/generate-image', (req, res) => {

    let name = req.query.name || 'DefaultName';
    let command = `
        magick images/sample-image.jpg \
        -fill white \
        -font "fonts/HeinekenSerif18-Bold.ttf" \
        -pointsize 120 -draw "text 420,485 '${name}'" \
        -pointsize 220 -draw "text 140,920 'Dynamic Text'" \
        -pointsize 220 -draw "text 140,1140 'Goes here'" \
        images/output-test.jpg
    `;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`ImageMagick exec error: ${error}`);
            res.status(500).send("Error Processing Image with ImageMagick");
            return;
        }

        console.log(`ImageMagick processed: ${stdout}`);
        console.error(`ImageMagick stderr (if any): ${stderr}`);
    });

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
