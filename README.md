Edviron Project Backned
API Routes

GET
http://54.81.99.124:8009/defaulter/:schoolId - to get all defaulter student from a School

GET
http://54.81.99.124:8009/dashboard/api/transaction/:schoolId - to get all transaction of that school

GET
http://54.81.99.124:8009/dashboard/api/transaction/:transactionId - to get one transaction with its id

PUT
http://54.81.99.124:8009/dashboard/api/update/transaction/:transactionId/status/:reconcile - change stastus of tgransaction

GET
http://54.81.99.124:8009/dashboard/api/get/disbursing - get all transaction of all school

POST
http://54.81.99.124:8009/dashboard/api/create/transaction/:schoolId - create transaction with school id (const {staus,amount,payment_mode}= req.body)
