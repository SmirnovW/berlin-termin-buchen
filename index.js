//https://service.berlin.de/terminvereinbarung/termin/tag.php?dienstleister=122251&herkunft=http%3A%2F%2Fservice.berlin.de%2Fstandort%2F122251%2F&termin=1&anliegen%5B%5D=120686

const express = require('express');
const axios = require('axios');
const bodyParser = require("body-parser")

const TOKEN = process.env.TOKEN;

const app = new express();

app.use(bodyParser.json()) // for parsing application/json
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
); // for parsing application/x-www-form-urlencoded


axios.get(`https://api.telegram.org/bot${TOKEN}/setWebhook?url=https://berlin-termin-buchen-bot.herokuapp.com/bot`);

app.get('/', (req, res) => {
    res.send(TOKEN);
});

app.post('/bot', (req, res) => {
    const { message } = req.body;

    axios
        .post(
            `https://api.telegram.org/bot${TOKEN}/sendMessage`,
            {
                chat_id: message.chat.id,
                text: message,
            }
        ).then((response) => {
            // We get here if the message was successfully posted
            console.log("Message posted")
            res.end("ok")
        });
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Telegram app listening on port 3000!")
});