const path = require('path');
const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();


// QUA SETTIAMO IL NOSTRO SERVER CON EXPRESS
const app = express();
const port = process.env.PORT || 5000;  //PORTA SU CUI ABBIAMO IL SERVER, SE NON NE ABBIAMO UNA DI DEFAULT PRENDE LA 5000
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));


//MONGODB E MONGOOSE
const uri = process.env.ATLAS_URI;  //LINK PER IL NOSTRO DATABASE MONGODB ATLAS
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () =>{
    console.log("Connessione al database MongoDB avvenuta con successo!")
})


// QUA SETTIAMO IL NOSTRO MIDDLEWARE
app.use(express.json());
app.use(express.static(buildPath));
app.use(express.urlencoded({ extended: false}));


//HTTP REQUEST LOGGER
const athleteRouter = require('./routes/athletes'); //DEFINISCO QUALE È LA SORGENTE DEL ROUTER DELLA SEZIONE ATLETI
const rulesRouter = require('./routes/rules'); //DEFINISCO QUALE È LA SORGENTE DEL ROUTER DELLA SEZIONE ATLETI
app.use('/athletes', athleteRouter);
app.use('/rules', rulesRouter);
app.get('*', function (request, response){
    response.sendFile(path.resolve(buildPath, 'index.html'))
    console.log("sono entrato dentro la funzione speciale!!")
    console.log("richiesta: "+request)
    console.log("risposta: "+response)
  })
if(process.env.NODE_ENV === "production"){
    app.use(express.static('build'))
}

// METTIAMO IL SERVER IN ASCOLTO SULLA PORTA CHE ABBIAMO SCELTO
app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`);
})