const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.DB_URL;

router.get('/', async (req, res) => {
  console.log('loo');
  res.send('hi');
});

// Get The list of Defaulter with passing School Id in params


router.get('/defaulter/:schoolId', async (req, res) => {
  try {
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
    const studentCollection  = database.collection('students');
    const duesCollection = database.collection('dues');
    const schoolObjectId = new ObjectId(schoolId);  
    // console.log(schoolId)
    // Find students for the given schoolId with pagination
    const students = await studentCollection 
      .find({ school_id: schoolObjectId })
      .toArray();

    if(!students || students.length === 0){
      return res.status(200).send({ success: true, msg: 'No students found' });
    }

     const studentIds = students.map(student => new ObjectId(student._id));

      const today = new Date();
      
      const overdueDues = await duesCollection
      .find({
        student: { $in: studentIds },
        due_date: { $lt: today },
      })
      .skip(skip)
      .limit(limit)
      .toArray();

      if(!overdueDues || overdueDues.length === 0){
        return res.status(200).send({ success: true, msg: 'No Dues found' });
      }

    
    await client.close();

    return res.json(overdueDues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

router.use('/dashboard',require('./dashboard'))
module.exports = router;
