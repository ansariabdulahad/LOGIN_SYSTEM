const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const database = require('./db');

exports.login = (request, response) => {

    const fullUrl = request.headers.referer + request.url.slice(1);

    let formData = '';

    request.on('data', (chunks) => {
        formData += chunks.toString();
    });

    request.on('end', async () => {

        const user = JSON.parse(formData);
        const query = {
            email: user.username
        }

        try {
            const successRes = await database.find(query, "users");
            const realPassword = successRes.data[0].password;

            bcrypt.compare(user.password, realPassword)
                .then((isMatched) => {

                    if (isMatched == true) {

                        const secret = crypto.randomBytes(10).toString('hex');
                        const data = {
                            secret: secret,
                            createdAt: new Date(),
                            isVerified: false
                        }

                        const insertRes = database.insertOne(data, "jwt_secrets");
                        insertRes.then((successRes) => {
                            const secret_id = successRes.data.insertedId;

                            // CONVERT DATA INTO JWT
                            const token = jwt.sign({
                                iss: fullUrl,
                                data: successRes.data[0]
                            }, secret, { expiresIn: 86400 }); // expires in 86400 seconds - (1 day)

                            const message = JSON.stringify({
                                isLoged: true,
                                message: "User Athenticated",
                                token: token,
                                secret_id: secret_id
                            });

                            sendResponse(response, 200, message);

                        }).catch((errorRes) => {
                            console.log("JWT SECRETS ERROR CONSOLE >>>", errorRes);
                            const message = JSON.stringify({
                                isLoged: false,
                                message: "Authentication failed"
                            });

                            sendResponse(response, 401, message);
                        })
                    }
                    else {

                        const message = JSON.stringify({
                            isLoged: false,
                            message: "Authentication failed"
                        });

                        sendResponse(response, 401, message);
                    }

                })
                .catch((notMatched) => {
                    console.log(notMatched);
                })

        } catch (errorRes) {

            const message = JSON.stringify({
                isLoged: false,
                message: "Username not found"
            });

            sendResponse(response, 404, message);
        }

    });

    // SEND RESPONSE FUNCTION CODING
    const sendResponse = (response, status_code, message) => {

        response.writeHead(status_code, {
            "Content-Type": "application/json"
        });

        response.write(message);
        response.end();
    }
}