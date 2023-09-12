const { exec } = require('child_process');
const fs = require('fs');
const { info } = require('console');
const axios = require('axios');
const XLSX = require('xlsx');

// const workbook = XLSX.readFile('nicknames.xlsx');
const workbook = XLSX.readFile('nickname_Less.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const range = XLSX.utils.decode_range(worksheet['!ref']);

// Extract the first row (headers) from the range
const headers = [];
for(let C = range.s.c; C <= range.e.c; ++C) {
    const cell = worksheet[XLSX.utils.encode_cell({r: range.s.r, c: C})];
    if(cell && cell.t) {
        headers.push(cell.v);
    }
}

// console.log("Headings ", headers );

const data = XLSX.utils.sheet_to_json(worksheet);

const extractedData = data
  .filter(row => 
    row["Friend's Name"] && row["Friend's Name"].trim() !== '' &&
    row["Nickname Submitted"] && row["Nickname Submitted"].trim() !== '' &&
    row["instagram"] && row["instagram"].trim() !== '')
  .map(row => ({
    friendsName: row["Friend's Name"],
    nickname: row["Nickname Submitted"],
    instagram: row["instagram"]
  }));



function escapeSingleQuotes(str) {
    return str.replace(/['\s]/g, "_");
}

function sanatizeNickName(change_nic) {
    return change_nic.replace(/['\s]/g, " ");
}

function splitString(inputStr) {
    let parts = inputStr.split(' ');
    if (parts.length < 4) return inputStr;  // Return original string if not enough words
    return `${parts[0]} ${parts[1]}\n${parts[2]} ${parts[3]},`;
}

extractedData.forEach((entry, index) => {
    const { friendsName, nickname, instagram } = entry;
    const sNo = index + 1;

    console.log(entry, "index: ", sNo);


    let command = `
        magick images/sample-image.png \
        -fill white \
        -font "fonts/HeinekenSerif18-Bold.ttf" \
        -pointsize 130 -draw "text 410,480 '${friendsName},'" \
        -pointsize 200 -draw "text 140,870 '${splitString(nickname)}'" \
        -pointsize 130 -draw "text 140,1455 '${instagram}'" \
        images/${sNo}-output-${escapeSingleQuotes(nickname)}.png
    `;

    console.log('Command', command);

    exec(command, {shell: true}, (error, stdout, stderr) => {
        console.log("Looping....");
        if (error) {
            console.error(`ImageMagick exec error for ${friendsName}: ${error}`);
            return;
        }

        console.log(`ImageMagick processed for ${friendsName}: ${stdout}`);
        console.error(`ImageMagick stderr for ${friendsName} (if any): ${stderr}`);
    });
})