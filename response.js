const statusToMsg = {
    200: 'success',
    201: 'craete success',
    400: 'client error',
    403: 'deny',
    404: 'not found',
    409: 'data redundancy',
    500: 'server error'
}

const response = async (res, statusCode, msg = statusToMsg[statusCode]) => {
    try {
        return res.status(statusCode).json({ result: msg })
    }
    catch (e) {
        console.error(e)
        return res.status(500).json({ result: 'server error' })
    }
}

module.exports = response
