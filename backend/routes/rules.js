const router = require('express').Router();
let Rules = require('../models/rule.model');
const rule = require('../models/rule.model');

//QUANDO VOGLIO VISUALIZZARE LA LISTA DI RULES
router.route('/').get((req, res) => {
    Rules.find()
    .then(rule => res.json(rule))
    .catch(err => res.status(400).json('Error: '+err));
})

// AGGIUNTA DI UNA SINGOLA REGOLA
 router.route('/add').post((req,res) => {
    const athletesId = req.body.athletesId;
    const name = req.body.name;
    const message = req.body.message;
    const conditions = req.body.conditions;
    const newRule = new rule({
        name,
        athletesId,
        conditions,
        message
    });

    newRule.save()
    .then(() => res.json('Rule added!'))
    .catch(err => res.status(400).json('Error: '+ err));
})




// RIMOZIONE DI UNA SINGOLO REGOLA
router.route('/:id').delete((req,res) => {
    Rules.findByIdAndDelete(req.params.id)
    .then(() => res.json("Rule deleted from database!"))
    .catch(err => res.status(400).json('Error: '+err));
})


// QUANDO SI VOGLIONO MODIFICARE LE INFORMAZIONI DI UNA SINGOLA REGOLA
router.route('/update/:id').post((req,res) => {
    Rules.findById(req.params.id)
    .then(rule => {
        rule.athletesId = req.body.athletesId;
        rule.name = req.body.name;
        rule.message = req.body.message;
        rule.conditions = req.body.conditions;

        rule.save()
        .then(() => res.json('Rule updated!'))
        .catch(err => res.status(400).json('Error: '+err));
    })
    .catch(err => res.status(400).json('Error: '+err));
})



//QUANDO VISUALIZZO UNA SINGOLO REGOLA... non dovrebbe servire
router.route('/:id').get((req,res) => {
    Rules.findById(req.params.id)
    .then(rule => res.json(rule))
    .catch(err => res.status(400).json('Error: '+err));
})



module.exports = router; 


// COSE IN PIÙ 
// AGGIUNTA DI ATLETI
// ---> DA VERIFICARE SE QUESTA FUNZIONALITÀ È NECESSARIA

// ---> DA VERIFICARE SE QUESTA FUNZIONALITÀ È NECESSARI

// QUANDO SI VOGLIONO MODIFICARE LE INFORMAZIONI DI UN SINGOLO ATLETA
// ---> DA VERIFICARE SE QUESTA FUNZIONALITÀ È NECESSARIA