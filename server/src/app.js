const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Skribbl Clone API is running!"
    });
});

module.exports = app;