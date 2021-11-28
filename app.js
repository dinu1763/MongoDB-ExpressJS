const express = require("express");
const mongoose = require("mongoose");

/*
    1. Connect to a mongoDB server
    2. Create a Schema for our Data
    3. Create a Model from the Schema
*/ 

const connect = () =>{
    return mongoose.connect("mongodb+srv://dinu1763:Kums1763@cluster0.6tcqa.mongodb.net/test")
}

const app = express();

app.use(express.json());

const movieSchema = new mongoose.Schema({
    movie_name:{type: String, required:true},
    movie_genre:{type: String, required: true},
    production_year:{type: Number, required:true},
    budget:{type:Number, required:true}
},
{
    versionKey:false,
    timestamps:true,
});

const Movie = mongoose.model("movie", movieSchema); //movies

/* Movie
    get = "/"
    get = "/movies/:id"
    post = "/movies"
    patch = "/movies/:id"
    delete = "/movies/:id"
*/
app.get("/", async (req, res)=>{
    const movies = await Movie.find().lean().exec();
    res.send({movies});
});

// Anything done using mongoose is asynchronous (use "async" & "await" )
app.post("/movies", async (req, res)=>{
    try{
        const movie = await Movie.create(req.body);
    res.status(201).send(movie);
    } catch(e) {
        res.status(500).send({status :e});
    }
    
});

app.get("/movies/:id", async (req, res) =>{
    try{
        const movie = await Movie.findById(req.params.id).lean().exec();
        res.status(201).send({movie});
    } catch(e){
        res.status(500).send({status:e});
    }
});

app.patch("/movies/:id", async (req, res) =>{
    try{
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
        })
        .lean()
        .exec();
        res.send({movie});
    } catch(e){
        res.status(500).send({status:e});
    }
});

app.delete("/movies/:id", async (req, res) =>{
    try{
        const movie = await Movie.findByIdAndDelete(req.params.id).lean().exec();
        res.status(201).send({movie});
    } catch(e){
        res.status(500).send({status:e});
    }
});

app.listen("9000", async ()=>{
    await connect();
    console.log("Listening at 9000")
})
