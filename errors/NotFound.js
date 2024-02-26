const {StatusCodes} = require('http-status-codes')
const CustomError = require('./customError')

class NotFound extends CustomError {
    constructor(message){
        super(message)
        this.statusCode=StatusCodes.NOT_FOUND
    }
}

module.exports = NotFound