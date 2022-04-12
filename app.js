//jshint esversion:6


//First, lets config a lot of dependencies
const express = require("express");
const dotenv = require('dotenv').config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const { param } = require("express/lib/router");
const { render } = require("ejs");
const { renderFile } = require("ejs");
const app = express();

//const { find, findKey, includes } = require("lodash");
const my_api = process.env.MY_APIKEY;

//Now some dummy content
const homeStartingContent = "Welcome to this simple Journal, it is made using MongoDB, Express, EJS and Node.";
const aboutContent = "Made for simple tech knowledge demonstration, it is made using MongoDB, Express, EJS and Node.";
const contactContent = "You can contact me:";

//Here we use EJS, so let's make the request
app.set('view engine', 'ejs');

//Vintage bodyparser, lol
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Lets fire up the mongoDB Atlas
mongoose.connect("mongodb+srv://"+my_api+"@cluster0.laqkg.mongodb.net/simpleBlog?retryWrites=true&w=majority");

//Create the postSchema
const postSchema ={
  title: String,
  content: String
};

//Mongoose model
const Post = mongoose.model("Post", postSchema); //So we are telling mongoose, using loadash to create a collection called Posts on the DB, inside simpleBlog

//tell express what to do when home page is accessed
app.get('/', (req, res) => {

  Post.find({}, function(err, foundItems){
    //search Posts collection (remember, lodash automatic puts on plural, if an err return log the error, if no errors, give the posts as json)
    err ? console.log(err) : res.render("home",{
      homeStartingContent: homeStartingContent,
      posts: foundItems
    });
  });
});

//express route with custom parameter for the custom blog post
app.get('/posts/:blogPost', (req, res) => {

  Post.findOne({_id: req.params.blogPost}, function(err, foundItems){
    err ? console.log(err) : res.render("post", {
      title: foundItems.title,
      post: foundItems.content,
      id: foundItems._id
    });
  });
});

app.post('/delete', function (req, res) {

  const removePost = req.body.id;
  Post.findByIdAndDelete(removePost, function(err){
    err?console.log(err):res.redirect("/");
  });
});

app.get('/about', (req, res) => {
  res.render("about",{
    aboutContent: aboutContent,
  });
});

app.get('/contact', (req, res) => {
  res.render("contact",{
    contactContent: contactContent,
  });
});

app.get('/compose', (req, res) => {
  res.render("compose",{
    contactContent: contactContent,
  });
});

app.post('/compose', function (req, res) {

  const post = new Post ({
      title: req.body.blogTitle,
      content: req.body.blogPost
  });

  post.save(function(err){
    if (!err){
      res.redirect("/");
    } else {
      console.log(err);
    }
  });

  
});

app.listen(process.env.port || 3000, function() {
  console.log("Server started on port 3000");
});
