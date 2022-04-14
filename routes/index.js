var express = require('express');
var router = express.Router();

var journeyModel = require('../models/journeys');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/search', async function(req, res, next) {
  var departureCity = "Marseille"; //req.body.departureCity
  var arrivalCity = "Paris"; //req.body.arrivalCity
  var departureDate = "23/11/2018";
  console.log(typeof(departureDate));


  var aggregateJourney = journeyModel.aggregate();

  aggregateJourney.match({"departure":departureCity, "arrival":arrivalCity, "date":departureDate});
 
  // aggregateJourney.sort({"_id." : 1});

  var dataJourney = await aggregateJourney.exec();

  console.log(dataJourney);

  res.render('search', { dataJourney });
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }


  res.render('index', { title: 'Express' });
});

module.exports = router;
