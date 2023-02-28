const express = require('express');
const axios = require('axios');
const cheerio =require('cheerio');


const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send(" Welcome to the the Climate Change Api");
})

const newspapers = [
    {
        name:'The_Times',
        address:'https://www.thetimes.co.uk/environment/climate-change',
        base:''
    },{
        name:'Guardian',
        address:'https://www.theguardian.com/environment/climate-crisis',
        base:''
    },
    {
        name:'The_New_York_Times',
        address:'https://www.nytimes.com/international/section/climate',
        base:''
    },
   {
       name:'Hindustan_Times',
       address:'https://www.hindustantimes.com/ht-insight/climate-change',
       base:'https://www.hindustantimes.com/',
       
   },
    {
        name:'Climate_Change',
        address:'https://www.climatechangenews.com/',
        base:''
    },
    {
        name:'News_Scientist',
        address:'https://www.newscientist.com/article-topic/climate-change/',
        base:''
    },
    {
        name:'Down to Earth',
        address:'https://www.downtoearth.org.in/news',
        base:''
    },
    {
        name:'The times of India',
        address:'https://timesofindia.indiatimes.com/home/environment',
        base:'htttps://timesofindia.indiatimes.com'
    },
    {
        name:'Cnn',
        address:'https://edition.cnn.com/specials/world/cnn-climate',
        base:''
    },
    {
        name:'The Hindu',
        address:'https://www.thehindu.com/sci-tech/energy-and-environment/',
        base:''
    },
    {
        name:'United Nations',
        address:'https://news.un.org/en/news/topic/climate-change',
        base:''
    },{
        name:'Telegraph',
        address:'https://www.telegraph.co.uk/climate-change',
        base:'https://www.telegraph.co.uk'
    },
    {
        name:'Inside_Climate',
        address:'https://insideclimatenews.org/',
        base:'',
    }

]
const articles = [];


newspapers.forEach(newspaper =>{
    axios.get(newspaper.address)
    .then(response=>{
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("climate")',html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
           

            articles.push({
                source : newspaper.name,
                title,
                url: newspaper.base + url,   
            })
        }) 
    })
})

app.get('/news',(req,res)=>{
    res.json(articles);
})

app.get('/news/:newspaperId', (req,res)=>{
    const newsPaperId = req.params.newspaperId;

   const newsPaperAddress= newspapers.filter(newspaper=> newspaper.name === newsPaperId)[0].address
    const newsPaperBase = newspapers.filter(newspaper=> newspaper.name === newsPaperId)[0].base


  axios.get(newsPaperAddress)
  .then(response=>{
    const html = response.data;
    const $ = cheerio.load(html);
    const specificArticles = [];
    
    $('a:contains("climate")',html).each(function(){
        const title = $(this).text()
        const url = $(this).attr('href');
        specificArticles.push({
            title,
            url: newsPaperBase + url,
            source: newsPaperId
        })
    })
    res.json(specificArticles);
  }).catch(err=>console.log(err));
})

app.listen(PORT,()=>{
    console.log(`The Website is running on port ${PORT}`);
})
