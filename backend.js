const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery',false);
const PORT = 8060;
app.use(express.json())

// Mongo DB connection establishment and model initializations
const connectDB = async () => {
    mongoose.connect(
    "mongodb+srv://rusira:rusira123@cluster0.2ouhrwy.mongodb.net/Jokes?retryWrites=true&w=majority"
    ).then((responde) => {
        console.log(responde)
    });
    const jokesSchema = new mongoose.Schema({
        description: String,
        type: String
    });
    Jokes_model = mongoose.model("jokes",jokesSchema)
}
// api call to retriew a random joke from the database
app.get('/random-joke', async (req,res) => {
    const {joke_type} = req.body;
    const data = await Jokes_model.find({"type":joke_type});
    // maipulation to get a random joke
    const randomIndex = Math.floor(Math.random() * data.length);
    const random_joke = data[randomIndex];
    // --------------------------------
    console.warn(random_joke);
    if(!random_joke){
        return res.json({status: "error", error: `Couldn't find a joke for the type - ${joke_type}`});
    }
    return res.json({status: "ok", data: random_joke});
});
// api call to retriew all joke types to be shown in the list
app.get('/joke-types', async (req,res) => {
    const joke_types = await Jokes_model.find();
    var typesArray = new Array();
    joke_types.forEach(element => {
        console.warn(element.type)
        if(!typesArray.includes(element.type)){
            typesArray.push(element.type)
        }
    });
    console.warn(joke_types)
    if(!joke_types){
        return res.json({status: "error", error: "Couldn't find joke types"});
    }
    return res.json({status: "ok", data: typesArray});
});

connectDB();

app.listen(
    PORT,
    () => console.log(`It's alive on http://localhost:${PORT}`)
)