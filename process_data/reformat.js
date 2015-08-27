var path = require("path");
var jsonfile = require("jsonfile");
var _ = require("lodash");
var async = require("async");

/* IIFE */
(function(){
  var srcPath = path.join("..", "assets", "data", "servy_data.json");
  var dstPath = path.join("..", "assets", "data", "modified_servy_data.json");
  var asyncFuncs = [];
  var lastWeekDate = new Date();
  lastWeekDate.setTime(lastWeekDate.getTime() - 14 * 24 * 60 * 60 * 1000);

  jsonfile.readFile(srcPath, function(err, data) {
    data = data.Report[0];
    // console.log(JSON.stringify(data));
    // _.forIn(data, function(value, key){
    //   console.log(data[key]);
    //   asyncFuncs.push(function(callback){
    //
    //     callback(null, 'Finished...');
    //   });
    // });

    async.forEachOf(data, function (value, key, callback) {
      asyncFuncs.push(function(callback){
        lastWeekProp(value);
        mostRecentProp(value);
        callback(null, value);
      });
      callback();
    }, function (err) {
      if (err)
        console.error(err.message);
    });

    async.parallel(asyncFuncs, function(err, results){
      // jsonfile.writeFile(dstPath, results, function(err){
      //   console.log('Complete!');
      // });
      jsonfile.writeFile(dstPath, data, function(){

      });
      // console.log(JSON.stringify(data, '\t'));
      console.log("Done.")
    });
  });



  var lastWeekProp = function(value){
    var newArray = _.sortBy(_.values(value.Evaluations), function(item){
      return [new Date(item.EvaluationDate)];
    });

    var mostRecentDate = new Date(newArray[newArray.length - 1].EvaluationDate);
    if(value.RestaurantID === 5501) console.log(mostRecentDate, lastWeekDate)
    value.WithinLastWeek = (mostRecentDate >= lastWeekDate) ? true : false;
  };

  var mostRecentProp = function(value){
    // value.MostRecentEvaluation =
  };
}());
