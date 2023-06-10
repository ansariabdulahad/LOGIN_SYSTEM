const query = require('querystring');
const jwt = require('jsonwebtoken');
const { sendResponse } = require('../constant/sendResponse.constant');
const { MESSAGE, STATUS_CODE } = require('../constant/common.constant');
const database = require('./db');

exports.verifyToken = (request, response) => {
    let formData = '';

    request.on('data', (chunks) => {
        formData += chunks.toString();
    });

    request.on('end', () => {
        const post = query.parse(formData);
        const message = {
            isVerified: MESSAGE.FALSE,
            message: MESSAGE.INVALID_TOKEN
        }
        if (post.token && post.token != "") {

            const secretId = post.secretId;
            const findRes = database.findById(secretId, "jwt_secrets");
            findRes.then((successRes) => {
                const secret = successRes.data[0].secret;

                // VERIFY TOKEN
                jwt.verify(post.token, secret, (error, success) => {
                    if (success) {
                        const message = {
                            isVerified: MESSAGE.TRUE,
                            message: MESSAGE.TOKEN_VERIFIED
                        }

                        sendResponse(response, STATUS_CODE[200], message);
                    }
                    else {
                        sendResponse(response, STATUS_CODE[401], message);
                    }
                })

            }).catch((errorRes) => {
                console.log("ERROR :: UNABLE TO FIND SECRET ID >>>", errorRes);
                sendResponse(response, STATUS_CODE[404], errorRes);
            })
        }
        else {
            sendResponse(response, STATUS_CODE[401], message);
        }
    });
}