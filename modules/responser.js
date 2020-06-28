//response for success status
exports.successResponse = (res, data, message) => {
    return res.json({
        message: message ? [message] : null,
        data
    })
}

//response for bad request
exports.errorResponse = (res, message) => {
    const environment = process.env.NODE_ENV
    if (environment !== 'test') {
        return res.status(400).json({
            message: message ? [message] : null,
            data:null
        })
    }else{
        return message
    }
    
}

//response for custom error status
exports.errorResponseStatus = (res, status, message) => {
    const environment = process.env.NODE_ENV
    if (environment !== 'test') {
        return res.status(status).json({
            message: message ? [message] : null,
            data:null
        })
    }else{
        return message
    }
    
}

//response for form validation error
exports.formErrorValidationResponse = (errors, res) => {
    return res.status(400).json({
        message: errors.map(item => {
            return item.msg
        }),
        data: null
    })
}

// handle error response from server or request
exports.errorResponseHandle = (error, res) => {
    if (typeof error !== 'undefined') {
        let status = 500
        if (error) {
            status = (error.status ? error.status : 500)
        }
        
        try {
            return res.status(status).json({
                message: [error.message],
                data: null
            })
        } catch (error) {
            console.log('eror', error.message)
        }
        
    } else {
        return error
    }
}