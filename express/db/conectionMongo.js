const mongo = require("mongoose");

mongo.Promise = global.Promise;

module.exports = {
    conectar: async app => {
        await mongo.connect("mongodb+srv://nathaliagiron:nathalia123%28%29@cluster0-vbpi7.mongodb.net/e4Realtime", {
            useNewUrlParser: true
        });
    }
};