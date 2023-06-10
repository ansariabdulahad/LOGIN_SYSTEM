const http = require('http');
const fs = require('fs');

const { signup } = require('./node_api/signup');
const { login } = require('./node_api/login');
const { verifyToken } = require('./node_api/verifyToken');
const { MESSAGE, STATUS_CODE, CONTENT_TYPE } = require('./constant/common.constant');

const port = process.env.PORT || 8080;

const route = (path, response, code, type) => {

    fs.readFile(path, (err, data) => {
        if (err) throw err;

        response.writeHead(code, {
            "Content-Type": type
        });
        response.write(data);
        response.end();
    })

}

const server = http.createServer(async (request, response) => {

    var path = '';
    var successCode = STATUS_CODE[200];
    var failCode = STATUS_CODE[404];
    var htmlType = CONTENT_TYPE.TEXT_HTML;
    var cssType = CONTENT_TYPE.TEXT_CSS;
    var jsType = CONTENT_TYPE.TEXT_JAVASCRIPT;
    var imgType = CONTENT_TYPE.IMAGE_JPEG;

    if (request.url == '/' || request.url == '/home') {
        path = 'html/homepage.html';
        route(path, response, successCode, htmlType);
    }
    else if (request.url == '/aboutus') {
        path = 'html/aboutus.html';
        route(path, response, successCode, htmlType);
    }
    else if (request.url == '/css/index.css') {
        path = 'css/index.css';
        route(path, response, successCode, cssType);
    }
    else if (request.url == '/css/homepage.css') {
        path = 'css/homepage.css';
        route(path, response, successCode, cssType);
    }
    else if (request.url == '/css/profile.css') {
        path = 'css/profile.css';
        route(path, response, successCode, cssType);
    }
    else if (request.url == '/js/homepage.js') {
        path = 'js/homepage.js';
        route(path, response, successCode, jsType);
    }
    else if (request.url == '/js/profile.js') {
        path = 'js/profile.js';
        route(path, response, successCode, jsType);
    }
    else if (request.url == '/image') {
        path = 'images/404_animation.gif';
        route(path, response, failCode, imgType);
    }
    // NODE API ROUTES
    else if (request.url == '/api/signup' && request.method == 'POST') {

        signup(request, response);
    }
    else if (request.url == '/api/login' && request.method == 'POST') {
        login(request, response);
    }
    else if (request.url == '/api/verifyToken' && request.method == 'POST') {
        verifyToken(request, response);
    }
    else {

        // AUTHENTICATED ROUTE
        let regExp = {
            profile: /\/profile\?token=/
        }
        if (regExp.profile.test(request.url)) {
            path = 'html/profile.html';
            route(path, response, successCode, htmlType);
        }
        else {
            path = 'html/notfound.html';
            route(path, response, failCode, htmlType);
        }
    }

});

server.listen(port);