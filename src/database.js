const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/electrondb', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(db =>
        console.log('DB is connected'))
    .catch(e => {
        console.log(e);
    })