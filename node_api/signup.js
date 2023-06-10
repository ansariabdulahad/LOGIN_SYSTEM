const database = require('./db');
const bcrypt = require('bcrypt');

const { sendResponse } = require('../constant/sendResponse.constant');

exports.signup = (request, response) => {

    let formData = '';

    request.on('data', (chunks) => {
        formData += chunks;
    });

    request.on('end', () => {

        const userInfo = JSON.parse(formData);

        const query = {
            email: userInfo.email,
        }

        const findRes = database.find(query, "users");

        findRes.then((successRes) => {

            sendResponse(response, successRes.status_code, successRes);

        }).catch((errorRes) => {

            bcrypt.hash(userInfo.password, 10).then((encryptPass) => {

                userInfo['password'] = encryptPass;
                userInfo['created_at'] = new Date();
                userInfo['updated_at'] = new Date();
                userInfo['emailVerified'] = false;
                userInfo['mobileVerified'] = false;

                createUser(userInfo, response);
            })

        })
    })
}

const createUser = (userInfo, response) => {

    const insertRes = database.insertOne(userInfo, "users");

    insertRes.then((successRes) => {

        sendResponse(response, successRes.status_code, successRes);

    }).catch((errorRes) => {

        sendResponse(response, errorRes.status_code, errorRes);

    })
}

// response constant function
// const sendResponse = (response, status_code, message) => {
//     response.writeHead(status_code, {
//         "Content-Type": "application/json",
//     });

//     const serverRes = JSON.stringify({
//         message: message
//     });

//     response.write(serverRes);
//     response.end();
// }