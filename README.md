# Restaurant Dashboard

Salespeople can make informed decisions based on restaurant evaluations and other meta-information provided by the Google Places API through this beautiful dashboard.

##  Usage

Clone this repository and navigate to the directory.

    npm install
    bower install
    python -m SimpleHTTPServer 3000

Create a config.js file inside the process_data to utilize the Google Places API.

    module.exports = {
      key: 'API_KEY'
    };

## Notes

1. Reference for $resource service:

   http://fdietz.github.io/recipes-with-angular-js/consuming-external-services/consuming-restful-apis.html
