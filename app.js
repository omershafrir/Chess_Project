const express = require('express')
const app = express();

app.use(express.static("chess_game"));

app.get('/' , (req , res) => {
    // res.send("Hello")
    // console.log("get request")
    // res.send("HELLO")
    res.sendFile('./chess_game/index.html')
});

app.listen(3000 ,() => console.log("listening..."));