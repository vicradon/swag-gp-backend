'use strict'

class SharedController {
    missingRequirements(...params){
        return params.filter((param) => param === "")
    }
}
const sharedController = new SharedController()

module.exports = sharedController
