'use strict'

class SharedController {
    missingRequirements(...params){
        const errors = []
        params.forEach((param) => {
            if (!param[0]){
                errors.push(param[1])
            }
        })
        return errors
    }
}
const sharedController = new SharedController()

module.exports = sharedController
