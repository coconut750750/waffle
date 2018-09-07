/*
Source: https://medium.freecodecamp.org/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0
*/

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// API Calls
app.get('/api/yelp', (req, res) => {
    const yelp = require('yelp-fusion');

    const apiKey = process.env.YELP_APIKEY;
    console.log(apiKey);

    const client = yelp.client(apiKey);

    client.search({
        term: 'restaurants',
        location: 'bellevue, wa'
    }).then(response => {
        res.send({
            data: response.jsonBody.businesses
        });
    }).catch(e => {
        console.log(e);
    });

});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
