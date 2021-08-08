//https://service.berlin.de/terminvereinbarung/termin/tag.php?dienstleister=122251&herkunft=http%3A%2F%2Fservice.berlin.de%2Fstandort%2F122251%2F&termin=1&anliegen%5B%5D=120686

const express = require('express');
const axios = require('axios');
const bodyParser = require("body-parser")

const TOKEN = process.env.TOKEN;

const app = new express();

function sendMessage(message) {
    axios
    .post(
        `https://api.telegram.org/bot${TOKEN}/sendMessage`,
        {
            chat_id: 180833698,
            text: message,
        }
    ).then((response) => {
        // We get here if the message was successfully posted
        console.log("Message posted");
    });
}

function checkTermin(command = null) {
    return axios({
        url: 'https://service.berlin.de/terminvereinbarung/termin/tag.php?dienstleister=122251&herkunft=http%3A%2F%2Fservice.berlin.de%2Fstandort%2F122251%2F&termin=1&anliegen%5B%5D=120686',
        method: 'get',
        maxRedirects: 0,
    })
    .catch(response => {
//        console.log('response', response);
        if (response.response.status === 302) {
            return axios({
                url: 'https://service.berlin.de/terminvereinbarung/termin/day/',
                method: 'get',
                headers: {
                    cookie: response.response.headers['set-cookie'][0].split(';')[0]
                }
            });
        } else {
            sendMessage(`Something went wrong: ${response.response.status}`)
        }
        return null;
    })
    .then(response => {
        //console.log('response 2', response);
        if (response != null) {
            const regex = /[^t]\s?(buchbar)/gm;
            let res = [...response.data.matchAll(regex)];
            if (res.length > 1) {
                sendMessage('There is a free date https://service.berlin.de/terminvereinbarung/termin/tag.php?dienstleister=122251&herkunft=http%3A%2F%2Fservice.berlin.de%2Fstandort%2F122251%2F&termin=1&anliegen%5B%5D=120686');
            } else {
                if (command != null) {
                    sendMessage('No termins 😭');
                }
            }
        }
    })
    .catch(error => {
        sendMessage(`Something went wrong: ${error.message}`)
    });
}

app.use(bodyParser.json()) // for parsing application/json
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
); // for parsing application/x-www-form-urlencoded


axios.get(`https://api.telegram.org/bot${TOKEN}/setWebhook?url=https://berlin-termin-buchen-bot.herokuapp.com/bot`);

app.get('/', (req, res) => {
    res.send('home');
});

app.post('/bot', (req, res) => {
    const { message } = req.body;

    if (message && message.text.toLowerCase() === 'ping') {
        checkTermin(message.text)
        .then(() => {
            res.end();
        });
    }
});



setInterval(checkTermin, 5 * 60000);
//checkTermin();

app.listen(process.env.PORT || 3000, function() {
    console.log("Telegram app running")
});