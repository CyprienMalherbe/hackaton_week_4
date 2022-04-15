var express = require('express');
var router = express.Router();
var request = require('sync-request');

var journeyModel = require('../models/journeys');
var userModel = require('../models/users');


/* ---- GET HOME PAGE ---- */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* ---- SEARCH ---- */

router.get('/search', async function(req, res, next) {

  if(!req.session.user){
    res.redirect('/')
  }else{
    var aggregateCitiesDeparture = journeyModel.aggregate();
    aggregateCitiesDeparture.group({
      _id : {
        departureCity : '$departure'
      }
    });
    aggregateCitiesDeparture.sort({"_id.departureCity" : 1});
    var dataCitiesDeparture = await aggregateCitiesDeparture.exec();
  
    var aggregateCitiesArrival = journeyModel.aggregate();
    aggregateCitiesArrival.group({
      _id : {
        arrivalCity : '$arrival'
      }
    });
    aggregateCitiesArrival.sort({"_id.arrivalCity" : 1});
    var dataCitiesArrival = await aggregateCitiesArrival.exec();
    res.render('search', {dataCitiesDeparture, dataCitiesArrival});
  }
});


/* ---- SEARCH RESULTS ---- */

router.post('/search-result', async function(req, res, next) {
  var departureCity = req.body.departureCity;
  var arrivalCity = req.body.arrivalCity;
  var departureDate = new Date(req.body.dateDeparture+"T00:00:00.000Z");

  var aggregateJourney = journeyModel.aggregate();
  aggregateJourney.match({"departure":departureCity, "arrival":arrivalCity, "date":departureDate});
  aggregateJourney.sort({"departureTime" : -1});
  var dataJourney = await aggregateJourney.exec();

  if (dataJourney.length > 0) {
    res.render('search-result', { dataJourney });
  } else {
    res.redirect('/oops');
  }

});

router.get('/oops', function(req, res, next) {
  res.render('oops', { title: 'Express' });
});


/* ---- TICKETS ROUTE ---- */

router.get('/my-tickets', async function(req, res, next) {
  var addTrip = await journeyModel.findById(req.query.id);
  req.session.trip.push(addTrip)
  res.render('my-tickets', { dataJourney: req.session.trip });
});

/* ---- VALIDATED ROUTE ---- */

router.get('/validated', async function(req, res, next) {

  await userModel.updateOne(
    { _id : req.session.user.id},
    { $push: { userJourneys: { $each: req.session.trip }}}
 );

  res.render('validated');
});


router.get('/my-last-trips', async function(req, res, next) {

//   await userModel.updateOne(
//     { _id : req.session.user.id},
//     { $push: { userJourneys: { $each: req.session.trip }}}
//  );

  var data = await userModel.findById(req.session.user.id).populate('userJourneys');

  res.render('my-last-trips', { data });
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
