exports.successResponse = (res, data, message) => {
    return res.json({
        message: message ? [message] : null,
        data
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