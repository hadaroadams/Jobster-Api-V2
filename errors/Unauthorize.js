const {StatusCodes} = require('http-status-codes')
const CustomError = require('./customError')

class UnathorizedError extends CustomError {
    constructor(message){
        super(message)
        this.statusCode=StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnathorizedError