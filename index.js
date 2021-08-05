//https://service.berlin.de/terminvereinbarung/termin/tag.php?dienstleister=122251&herkunft=http%3A%2F%2Fservice.berlin.de%2Fstandort%2F122251%2F&termin=1&anliegen%5B%5D=120686

const express = require('express');
const axios = require('axios');

const app = new express();

const TOKEN = process.env.TOKEN;

//axios.get(`https://api.telegram.org/bot${TOKEN}/setWebhook?url=https://berlin-termin-buchen-bot.herokuapp.com/bot`);

app.get('/', (req, res) => {
    res.send(TOKEN);
});
/*

app.post('/bot', (req, res) => {
    const { message } = req.body;

    axios
        .post(
            `https://api.telegram.org/bot${TOKEN}/sendMessage`,
            {
                chat_id: message.chat.id,
                text: message,
            }
        );
});
*/

app.listen(443, function() {
    console.log("Telegram app listening on port 3000!")
});