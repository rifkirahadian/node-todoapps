exports.successResponse = (res, data, message) => {
    return res.json({
        message: message ? [message] : null,
        data
    })
}

exports.errorResponse = (res, message) => {
    return res.status(400).json({
        message: message ? [message] : null,
        data:null
    })
}

exports.formErrorValidationResponse = (errors, res) => {
    return res.status(400).json({
        message: errors.map(item => {
            return item.msg
        }),
        data: null
    })
}

exports.errorResponseHandle = (error, res) => {
    if (typeof error !== 'undefined') {
        let status = 500
        if (error) {
            status = (error.status ? error.status : 500)
        }
        
        return res.status(status).json({
            message: [error.message],
            data: null
        })
    } else {
        return error
    }
}