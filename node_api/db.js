const mongodb = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const { STATUS_CODE, MESSAGE } = require('../constant/common.constant');

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'nodejust';
const CollectionName = 'users';

// connection established with mongodb
const config = () => {

    return new Promise((resolve, reject) => {
        mongodb.connect(url)
            .then((connection) => {
                const db = connection.db(dbName);

                resolve(db);

            }).catch((error) => {

                reject(error);
            })
    })
}

// fetch and find collection by id
exports.findById = (id, collection_name) => {

    return new Promise((resolve, reject) => {
        config().then((db) => {

            db.collection(collection_name).find({ "_id": new ObjectId(id) }).toArray().then((dataRes) => {

                if (dataRes.length != 0) {

                    resolve({
                        status_code: STATUS_CODE[200],
                        message: MESSAGE.COLLECTION_FOUND,
                        data: dataRes
                    });

                } else {

                    reject({
                        status_code: STATUS_CODE[404],
                        message: MESSAGE.COLLECTION_NOT_FOUND
                    });
                }

            }).catch((error) => {

                console.log(error);
            })

        }).catch((error) => {

            console.log(error);
        })
    });
}

// fetch and find collection
exports.find = (query, collection_name) => {

    return new Promise((resolve, reject) => {
        config().then((db) => {

            db.collection(collection_name).find(query).toArray().then((dataRes) => {

                if (dataRes.length != 0) {

                    resolve({
                        status_code: STATUS_CODE[200],
                        message: MESSAGE.COLLECTION_FOUND,
                        data: dataRes
                    });

                } else {

                    reject({
                        status_code: STATUS_CODE[404],
                        message: MESSAGE.COLLECTION_NOT_FOUND
                    });
                }

            }).catch((error) => {

                console.log(error);
            })

        }).catch((error) => {

            console.log(error);
        })
    });
}

// Insert One
exports.insertOne = (formData, collection_name) => {

    return new Promise((resolve, reject) => {
        config().then((db) => {

            db.collection(collection_name).insertOne(formData).then((dataRes) => {

                resolve({
                    status_code: STATUS_CODE[200],
                    message: MESSAGE.COLLECTION_SUCCESSFULLY_INSERTED,
                    data: dataRes
                })

            }).catch((error) => {

                reject({
                    status_code: STATUS_CODE[500],
                    message: MESSAGE.COLLECTION_UNABLE_TO_INSERT,
                    error: error
                })
            })

        }).catch((error) => {

            console.log(error);
        })
    });
}