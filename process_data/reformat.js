var path = require("path");
var jsonfile = require("jsonfile");
var _ = require("lodash");
var async = require("async");

/* Import the configuration file with API key. */
var config = require("");

/**/

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
        setNewProps(value);
        callback(null, value);
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
            Report: []
          };

          /* Group restaurants by name. */
          modifiedData.Report.push(groupRestaurants(data));
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
   * Set WithinLastWeek and MostRecent properties.
   * value parameter references the actual raw data.
   */
  var setNewProps = function(value){
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
    value.WithinLastWeek = (mostRecentDate >= lastWeekDate) ? true : false;
  };

  var groupRestaurants = function(data){
    return _.groupBy(_.values(data), function(d){
      return d.Name;
    });
  };

  /*
   * Helper function for formatting date.
   */
  Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
  }
}());
