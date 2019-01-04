var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Campground.create(
//     {
//         name: "Granite Hill", 
//         image: "https://images.unsplash.com/photo-1534187886935-1e1236e856c3?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=384a51f2b8eaff486e080f101afc8192&auto=format&fit=crop&w=500&q=60",
//         description: "This is a huge granite hill"
//     }, 
//     function(err,campground){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("New campground");
//         console.log(campground);
//     }
// });

//INDEX - show all campgrounds

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds:allCampgrounds});
        }
    });
});

//CREATE - add new campground to DB

app.post("/campgrounds", function(req, res){
    //get data from form and add to campgounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    //Create new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
    // campgrounds.push(newCampground);
});

//NEW - show form to create new campground

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

//SHOW - shows more info about one campground

app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err);
       } else {
           //render show template with that campground
           res.render("show", {campground: foundCampground});
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server Has Started");
});