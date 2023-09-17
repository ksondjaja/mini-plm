// based on tutorial https://faerulsalamun.medium.com/restful-api-with-node-js-express-and-dynamodb-5059beb3ba7f

const StyleController = require('../modules/style/controller/style.controller');

module.exports = async (app) => {
    app.get('/api/v1/styles/:StyleId',StyleController.findById);
    app.post('/api/v1/styles', StyleController.create);
    app.patch('/api/v1/styles/:StyleId', StyleController.update);
    app.delete('/api/v1/styles/:StyleId', StyleController.deleteById);
};