const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const j2cp = require('json2csv').Parser;
const fs = require('fs');


const app = express();
const Port = process.env.Port || 5000;
const url = 'https://www.theguardian.com/uk';
const article = [];
axios(url)
        .then(response=>{
            const $ = cheerio.load(response.data); 

            const articles = $('.fc-item__title',response.data);
             articles.each(function(){
               const title =  $(this).text();
               const url = $(this).find('a').attr('href');
               article.push({ title,url})

             });
             const parser = new j2cp();
             const csv = parser.parse(article);
             fs.writeFileSync("./articles.csv",csv);
            console.log(article); 


            
        }).catch(err=>console.log(err))

app.listen(Port,()=>{
    console.log(`The port is running on host ${Port}`);
})