const path = require('path');
const { spawn } = require('child_process');
const dataRegister = require('../models/dataRegisterModel');
const resultData = require('../models/resultModel');

module.exports = {

    uploadFile: async (req, res) => {
        try {
            console.log('uploadfile');
            let nameFile = 'file.csv';
            let { date } = req.body;
            if (Object.keys(req.files).length == 0) {
                return res.status(400).send({
                    code: 400,
                    description: 'No files were uploaded.',
                    response: null
                });
            }
            let e4File = req.files.e4File;
            e4File.mv(`../e4App-server/e4-records/${nameFile}`, function (err) {
                const path = `../e4App-server/e4-records/${nameFile}`;
                if (err)
                    return res.status(500).send(err);

                const subprocess = runScript();

                // print output of script
                subprocess.stdout.on('data', (data) => {
                    switch (`${data}`) {
                        case 'true\n':
                            pushData(date, true);
                            break;
                        case 'false\n':
                            pushData(date, false);
                            break;
                        default:
                            console.log('nothing');
                            break;
                    }
                });
                subprocess.stderr.on('data', (data) => {
                    console.log(`error:${data}`);
                });
                subprocess.stderr.on('close', () => {
                    // console.log("Closed");
                });


                res.status(200).send({
                    code: 200,
                    description: 'success',
                    response: path
                });
            });
        } catch (error) {
            console.log('uploat request error', error); // the uploaded file object
            res.status(500).send({
                code: 500,
                description: 'Server error',
                message: error
            });
        }
    },

    /* Upload Data */
    uploadData: async (req, res) => {
        console.log('request uploadData');
        try {
            let register = req.body;
            dataRegister.create(register, function (err, response) {
                const dataResult = response;
                res.send({
                    code: 200,
                    description: 'success',
                    response: dataResult
                });
            });
        } catch (error) {
            console.log('Error uploadData: ' + error);
            res.status(500).send({
                code: 500,
                description: 'Server error',
                message: error
            });
        }
    },
    /* GET RESULT */
    getResults: async (req, res) => {
        try {
            console.log('getResults request');
            const dateId = req.query.dateId;
            const result = await resultData.findOne({ dateId: dateId });
            if (result) {
                res.send({
                    code: 200,
                    description: 'success',
                    response: result
                });
            } else {
                res.send({
                    code: 404,
                    description: 'not found',
                    response: {}
                });
            }
        } catch (error) {
            res.status(500).send({
                code: 500,
                description: 'server error',
                message: error
            });
        }
    },
}


function runScript() {
    return spawn('python', [
        "-u",
        path.join(__dirname, 'script.py'),
        "--foo", "Test E4",
    ]);
}

function pushData(date, result) {
    try {
        const object = {
            dateId: date,
            result: result
        }
        resultData.create(object, function (err, response) {
            const dataResult = response;
            console.log('RESPONSE STORED DATA', dataResult);
        });
    } catch (error) {
        console.log('Error upload result: ' + error);
    }
}



