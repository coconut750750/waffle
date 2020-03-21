/*
Source: https://medium.freecodecamp.org/how-to-make-create-react-app-work-with-a-node-backend-api-7c5c48acb1b0
*/

const express = require('express');
const path = require('path');
const yelp = require('yelp-fusion');

const app = express();
const port = process.env.PORT || 5000;

// API Calls
app.get('/api/yelp', (req, res) => {

    var yelp_query;
    if (req.query.city) {
        yelp_query = {
            location: req.query.city,
        }
    } else {
        yelp_query = {
            latitude: req.query.lat,
            longitude: req.query.long,
        }
    }
    yelp_query['term'] = 'restaurants';

    const apiKey = process.env.YELP_APIKEY;
    const client = yelp.client(apiKey);
    client.search(yelp_query).then(response => {
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

if (process.env.NODE_ENV === 'dev') {
    require('dotenv').config(); 
}

app.listen(port, () => console.log(`Listening on port ${port}`));
