// based on tutorial https://faerulsalamun.medium.com/restful-api-with-node-js-express-and-dynamodb-5059beb3ba7f

const StyleService = require('../service/style.service');

class StyleController {

    async findById(req, res) {
        const data = await StyleService.findByID(req.params.StyleId)

        res.json(data)
    }

    async create(req, res) {
        const data = await StyleService.create(req.body)

        res.json(data)
    }

    async update(req, res) {
        const data = await StyleService.update(req.params.StyleId, req.body)

        res.json(data)
    }

    async deleteById(req, res) {
        await StyleService.deleteByID(req.params.StyleId)

        res.json(`Success`)
    }

}

module.exports = new StyleController()