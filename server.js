
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Note, Article } = require('./Models');
const morgan = require('morgan');
const request = require('request');
const cheerio = require('cheerio');




var app = express();
var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/article_finder'



mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));


app.use(express.static('Public'));


app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');








app.get("/", function (req, res) {
  Article.find({})
    .then(function (dbArticle) {

      res.render("index", { articles: dbArticle });
    })
    .catch(function (err) {

      res.json(err);
    });
})


app.get("/scrape", function (req, res) {
  request('https://www.nytimes.com', (err, response, html) => {

    var $ = cheerio.load(html);
    var results = [];

    $("article").each(function (i, element) {
      var ob = {};
      const anchor = $(element).find("a");
      ob.link = 'https://www.nytimes.com' + anchor.attr("href");
      ob.title = anchor.find('h2').text();
      ob.summary = anchor.find("p").text().trim();

      results.push(ob);
    });
    console.log('results', results);
    Article.insertMany(results)
      .then(function (dbArticles) {
        console.log('dbArticles', dbArticles)
        res.json(dbArticles);
      }).catch(function (err) {

        return res.json(err);
      });
  });



});



app.get("/articles", function (req, res) {

  Article.find({})
    .then(function (dbArticle) {

      res.json(dbArticle);
    })
    .catch(function (err) {

      res.json(err);
    });
});

app.listen(PORT, function () {
  console.log("App running on port" + PORT);
});


