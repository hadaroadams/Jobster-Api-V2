const {StatusCodes} = require('http-status-codes') 

class CustomError extends Error{
    constructor(message){
        super(message)
    }
}

module.exports = CustomError