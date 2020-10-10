const router = require('express').Router();
let Athlete = require('../models/athlet.model');
const athlete = require('../models/athlet.model');

//QUANDO VOGLIO VISUALIZZARE LA LISTA DI ATLETI
router.route('/').get((req, res) => {
    Athlete.find()
    .then(athlete => res.json(athlete))
    .catch(err => res.status(400).json('Error: '+err));
})

//QUANDO VISUALIZZO UN SINGOLO ATLETA
router.route('/:id').get((req,res) => {
    Athlete.findById(req.params.id)
    .then(athlete => res.json(athlete))
    .catch(err => res.status(400).json('Error: '+err));
})

module.exports = router;

// COSE IN PIÙ 
// AGGIUNTA DI ATLETI
// ---> DA VERIFICARE SE QUESTA FUNZIONALITÀ È NECESSARIA
/* router.route('/add').post((req,res) => {

    const id = Number(req.body.id);
    const name = req.body.name;
    const weight = Number(req.body.weight);
    const height = Number(req.body.height);
    const dob = req.body.dob;
    const mfp = req.body.mfp;
    const activity = req.body.activity;
    const body = req.body.body;
    const sleep = req.body.sleep;
    const mood = req.body.mood;

    const newAthlete = new Athlete({
        id,
        name,
        weight,
        height,
        dob,
        mfp,
        activity,
        body,
        sleep,
        mood
    });

    newAthlete.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: '+ err));
}) */




// RIMOZIONE DI UN SINGOLO ATLETA
// ---> DA VERIFICARE SE QUESTA FUNZIONALITÀ È NECESSARIA
/* router.route('/:id').delete((req,res) => {
    Athlete.findByIdAndDelete(req.params.id)
    .then(athlete => res.json("Athlete delete from database!"))
    .catch(err => res.status(400).json('Error: '+err));
}) */


// QUANDO SI VOGLIONO MODIFICARE LE INFORMAZIONI DI UN SINGOLO ATLETA
// ---> DA VERIFICARE SE QUESTA FUNZIONALITÀ È NECESSARIA
/* router.route('/update/:id').post((req,res) => {
    Athlete.findById(req.params.id)
    .then(athlete => {
        athlete.id = Number(req.body.id);
        athlete.name = req.body.name;
        athlete.weight = Number(req.body.weight);
        athlete.height = Number(req.body.height);
        athlete.dob = req.body.dob;
        athlete.mfp = req.body.mfp;
        athlete.activity = req.body.activity;
        athlete.body = req.body.body;
        athlete.sleep = req.body.sleep;
        athlete.mood = req.body.mood;

        athlete.save()
        .then(() => res.json('Athlete updated!'))
        .catch(err => res.status(400).json('Error: '+err));
    })
    .catch(err => res.status(400).json('Error: '+err));
}) */

