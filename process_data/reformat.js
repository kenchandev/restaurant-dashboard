var path = require("path");
var jsonfile = require("jsonfile");
var _ = require("lodash");
var async = require("async");
var request = require("request");

/* Import the configuration file with API key. */
var apiKey = require("./config").key;

/* https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJiZfMBoZYwokRhMJwRoMM2xQ&key=AIzaSyA00AhzBP-1YTuYjtnTXXNh4z_4Jcl6SQ8 */

/* IIFE */
(function(){
  var srcPath = path.join("..", "assets", "data", "servy_data.json");
  var dstPath = path.join("..", "assets", "data", "modified_servy_data.json");
  var asyncFuncs = [];
  var modifiedData;
  var lastWeekDate = new Date();
  lastWeekDate.setTime(lastWeekDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  jsonfile.readFile(srcPath, function(err, data) {
    data = data.Report[0];

    async.forEachOf(data, function (value, key, callback) {
      asyncFuncs.push(function(callback){
        request('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + value.GooglePlacesID + '&key=' + apiKey, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            // console.log(body) // Show the HTML for the Google homepage.
            setNewProps(value, body);
          }
          else {
            setNewProps(value);
          }
          callback(null, value);
        });
      });
      callback();
    }, function (err) {
      if (err)
        console.error(err.message);
    });

    async.parallel(asyncFuncs, function(err, parallelResults){
      async.series([
        function(callback){
          modifiedData = {
            Restaurants: null
          };

          /* Group restaurants by name. */
          modifiedData.Restaurants = groupRestaurants(data);
          callback(null, 'Grouped data by restaurant name.');
        },
        function(callback){
          /* Write new .json file. */
          jsonfile.writeFile(dstPath, modifiedData, {spaces: 4}, function(err){
            console.log(err);
            callback(null, 'Finished writing to file.');
          });
        }
      ], function(err, seriesResults){
        console.log(err);
        console.log(seriesResults);
      })
    });
  });

  /*
   * Set WithinLastWeek, MostRecent, Ratings and ContactInformation properties.
   * value parameter references the actual raw data.
   */
  var setNewProps = function(value, body){
    var newArray = _.sortBy(_.values(value.Evaluations), function(item){
      return [new Date(item.EvaluationDate)];
    });

    var mostRecentDate = new Date(newArray[newArray.length - 1].EvaluationDate);
    value.MostRecent = [mostRecentDate.getFullYear(),
                       (mostRecentDate.getMonth()+1).padLeft(),
                        mostRecentDate.getDate().padLeft()].join('-') + ' ' +
                       [mostRecentDate.getHours().padLeft(),
                        mostRecentDate.getMinutes().padLeft(),
                        mostRecentDate.getSeconds().padLeft()].join(':');
    value.TotalEvalsLastWeek = _.filter(newArray, function(n) {
      var evalDate = new Date(n.EvaluationDate);
      return evalDate >= lastWeekDate;
    }).length;

    value.TotalEvals = _.keys(newArray).length;

    console.log(value.GooglePlacesID);

    value.PhoneNumber = null;
    value.OpeningHours = null;
    value.GoogleRating = null;
    value.GoogleRatingsTotal = null;
    value.GoogleRecentReviews = null;
    value.Website = null;

    if(body){
      body = JSON.parse(body);

      if(typeof(body) === 'object' && 'result' in body){
        var result = body.result;

        value.PhoneNumber =  ('formatted_phone_number' in result) ? result.formatted_phone_number : null;
        value.OpeningHours = ('opening_hours' in result) ? result.opening_hours.weekday_text : null;
        value.GoogleRating = ('rating' in result) ? result.rating : null;
        value.GoogleRatingsTotal = ('user_ratings_total' in result) ? result.user_ratings_total : null;
        value.GoogleRecentReviews = ('reviews' in result) ? result.reviews : null;
        value.Website = ('website' in result) ? result.website : null;
      }
    }
  };

  var groupRestaurants = function(data){
    var groupedData = _.groupBy(_.values(data), function(d){
      return d.Name;
    });

    return _.map(groupedData, function(value, key){
      var worstRatedRestaurant = _.min(value, function(d){
        if(d.GoogleRating !== null)
          return d.GoogleRating;
      });

      var totalEvals = _.sum(value, function(d){
          return d.TotalEvals;
      });

      var totalEvalsLastWeek = _.sum(value, function(d){
        return d.TotalEvalsLastWeek;
      });

      return {
        Name: key,
        Locations: value,
        TotalLocations: value.length,
        PoorestRating: worstRatedRestaurant.GoogleRating,
        TotalEvalsLastWeek: totalEvalsLastWeek,
        TotalEvals: totalEvals
      };
    });
  };

  /*
   * Helper function for formatting date.
   */
  Number.prototype.padLeft = function(base, chr){
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
  }
}());
