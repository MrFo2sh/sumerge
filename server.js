var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var cors = require('cors');

var userRouter = require('./routers/user-routes');

var config = require('./config');
// var auth = require('./middlewares/auth');

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

mongoose.connection.on("open", function() {
    console.log("Connected to mongo server.\n\n");
    var port = process.env.PORT || config.port;
    app.listen(port, function() {
        console.log('Listening on port ',port,'...');
    });
});

mongoose.connection.on("error", function(err) {
    console.log("Could not connect to mongo server!");
    console.log(err);
});


// app.use(auth.authenticate);


app.use(cors());

app.use("/api/users",userRouter);



// app.set('trust proxy', 1);


mongoose.connect(config.dbUri);