const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.DB_URL;

// API to retirve all Transaction (I implemented Pagination to handel large amount of data )
router.get('/api/getall/transaction/:schoolId',async(req,res)=>{

    try{
        const {schoolId} =req.params
    if(!schoolId){
      return res.status(400).send({ success: false, msg: 'schoolId not found' });
    }
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect();

    const database = client.db('test'); 
    const transactionCollection  = database.collection('transactions');
    const schoolObjectId = new ObjectId(schoolId);  

    const transactions = await transactionCollection
        .find({school:schoolObjectId})
        .skip(skip)
        .limit(limit)
        .toArray(); 
    
    if(!transactions || transactions.length === 0){
            return res.status(200).send({ success: true, msg: 'No transaction found' });
    }

    return res.send(transactions)
    }catch(err){
        return res.status(500).send({ success: false, msg: 'Internal server error' });
    }

})

// API to get a perticular tyransaction with its transaction Id
router.get('/api/transaction/:transactionId',async(req,res)=>{

    try{
        const {transactionId} =req.params
    if(!transactionId){
      return res.status(400).send({ success: false, msg: 'transactionId not found' });
    }
    

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect();

    const database = client.db('test'); 
    const transactionCollection  = database.collection('transactions');
    const transactionObjectId = new ObjectId(transactionId);  

    const transactions = await transactionCollection
        .find({_id:transactionObjectId})
        .toArray();
       
    
        console.log(transactions);
    if(!transactions || transactions.length === 0){
            return res.status(200).send({ success: true, msg: 'No transaction found' });
    }

    return res.send({transactions})
    }catch(err){
        return res.status(500).send({ success: false, msg: 'Internal server error' });
    }

})

// API to update Transaction with help of tgransaction id and updated value

router.put('/api/update/transaction/:transactionId/status/:reconcile',async(req,res)=>{
    try{
        const {transactionId,reconcile} =req.params
    if(!transactionId){
      return res.status(400).send({ success: false, msg: 'transactionId not found' });
    }
  
    if(!reconcile){
        return res.status(400).send({ success: false, msg: 'reconcile not found' });
    }

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect();

    const database = client.db('test'); 
    const transactionCollection  = database.collection('transactions');
    const transactionObjectId = new ObjectId(transactionId);  
    const transactions = await transactionCollection.updateOne(
        {_id:transactionObjectId},
        { $set: { status: reconcile } }
        )

    transactions.status = reconcile
    await transactions.save()
    console.log(transactions);

    return res.send(transactions.status)
    }catch(err){
        return res.status(500).send({ success: false, msg: 'Internal server error' });
    }

})

// get transaction of all schools
router.get('/api/get/disbursing',async(req,res)=>{
    
    try{
        const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect();

    const database = client.db('test'); 
    const transactionCollection  = database.collection('transactions');
    
  

    const transactionLog = await transactionCollection
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();

    res.send(transactionLog)
    }catch(err){
        return res.status(500).send({ success: false, msg: 'Internal server error' });
    } 
})

router.post('/api/create/transaction/:schoolId',async(req,res)=>{
    try{
        const {schoolId} =req.params
    if(!schoolId){
      return res.status(400).send({ success: false, msg: 'schoolId not found' });
    }

    const {staus,amount,payment_mode}= req.body
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect();

    const database = client.db('test'); 
    const transactionCollection  = database.collection('transactions');
    

    const newTransaction = {
        ...req.body,
        schoolId: schoolId,
    };

    const result = await transactionCollection.insertOne(newTransaction);
    if (result.insertedCount === 1) {
        return res.status(201).send({ success: true, msg: 'Transaction created successfully' });
    } else {
        return res.status(500).send({ success: false, msg: 'Failed to create the transaction' });
    }
    }catch(err){
        console.log(err);
        return res.status(500).send({ success: false, msg: 'Internal server error' });
    } 
})




module.exports = router;