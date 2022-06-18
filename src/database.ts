import mongoose from 'mongoose'

let dbURI: string = "";

// If docker is being used, replace 'localhost' from mongo URIs to 'mongo'.

if (process.env.NODE_ENV === 'development') {
    dbURI = process.env.MONGODB_URI_DEV || 'mongodb://localhost/dev';
    //dbURI = process.env.MONGODB_URI_PROD || 'mongodb://localhost/prod';
}

if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGODB_URI_PROD || 'mongodb://localhost/prod';
}

mongoose.connect(dbURI || 'mongodb://localhost/test')
    .then(() => console.log('Database is connected with URI: ' + `${dbURI}`))
    .catch(err => console.log(err));