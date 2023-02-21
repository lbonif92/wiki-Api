//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

// création d'un schéma
const articleSchema = {
  title: String,
  content: String
}

// création d'un nouveau modèle
const Articles = mongoose.model("Article", articleSchema);

// routage:

///////request all articles

app.route('articles')

.get(function(req,res){
    Articles.find(function(err, foundArticles){
        if (!err){
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    })
})

.post(function(req,res){
    const newArticle = new Articles({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if (!err){
            res.send("Successfully added a new article.")
        } else {
            res.send(err);
        }
    })
})

.delete(function(req,res){
    Articles.deleteMany({}, function(err){
        if(!err){
            res.send("Successfully deleted all articles");
        } else {
            res.send(err);
        }
    })
});

///request specific articles

app.route('/articles/:articleTitle' )
    
.get(function(req,res){

    Articles.findOne(
        {title: req.params.articleTitle},
        function(err, foundArticles){
        if (foundArticles){
            res.send(foundArticles);
        } else {
            res.send("No articles matching  that title was found");
        }
    });
})

.put(function(req, res){
    Articles.Update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true}, // écrase la précédente valeur
        function(err){
            if (!err){
                res.send("Successfully updated articles");
            } else {
                res.send(err);
            }
        });
        
})

.patch(function(req, res){
    Articles.Update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if (!err){
                res.send("Successfully updated the selected articles");
            } else {
                res.send(err);
            }
        });
})

.delete(function(err, res){
    Articles.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if (!err){
                res.send("Successfully deleted articles");
            } else {
                res.send(err);
            }
        }
    );
});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
