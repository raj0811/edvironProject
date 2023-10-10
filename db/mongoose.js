const mongoose= require('mongoose')
mongoose.connect(process.env.DB_URL)

const db = mongoose.connection;

db.on('error',console.error.bind(console,`Error in Connecting to DB`))

db.once('open',function(){
    console.log(`Sucessfully Connected to Database`);
})