const statusToMsg = {
    200: 'success',
    201: 'create success',
    400: 'client error',
    401: 'unauthorized',
    403: 'forbidden',
    404: 'not found',
    409: 'data redundancy',
    500: 'server error'
}

const response = async (res, statusCode, msg = statusToMsg[statusCode]) => {
    try {
        console.log(msg);
        return res.status(statusCode).json({ result: msg })
    }
    catch (e) {
        console.error(e)
        return res.status(500).json({ result: 'server error' })
    }
}

module.exports = response
