const { CONTENT_TYPE } = require('./common.constant');

exports.sendResponse = (response, status_code, message) => {
    console.log("IN SEND RESPONSE");
    response.writeHead(status_code, {
        "Content-Type": CONTENT_TYPE.APPLICATION_JSON,
    });

    response.write(JSON.stringify(message));
    response.end();
}