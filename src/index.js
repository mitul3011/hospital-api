const express = require('express');
const db = require('./db/mysql');
const multer = require('multer');
const sharp = require('sharp');
const validatePatientData = require('./validatePatientData');
const generateError = require('./generateError');

const app = express();
const port = process.env.PORT;

app.use(express.json());

// Route to fetch hospital data
app.get('/api/hospitaldata', (req, res) => {
    try {
        if(req.body.hospitalID < 1 || req.body.hospitalID > 4){
            throw generateError('Enter valid hospital id.', 404);
        }

        const sql = `SELECT hospitals.name, COUNT(psychiatrists.name) AS "Total Psychiatrist count" FROM hospitals INNER JOIN psychiatrists ON hospitals.id=psychiatrists.hospitalID WHERE psychiatrists.hospitalID=${req.body.hospitalID} GROUP BY psychiatrists.hospitalID;
                    SELECT COUNT(DISTINCT patients.name) AS "Total patients count" FROM psychiatrists INNER JOIN patients ON psychiatrists.id=patients.psychiatristID INNER JOIN hospitals ON hospitals.id=psychiatrists.hospitalID WHERE hospitals.id=${req.body.hospitalID};
                    SELECT psychiatrists.id, psychiatrists.name, COUNT(patients.id) AS "Patients count" FROM psychiatrists LEFT OUTER JOIN patients ON psychiatrists.id=patients.psychiatristID WHERE psychiatrists.hospitalID=${req.body.hospitalID} GROUP BY psychiatrists.id;`;
        db.query(sql, (error, result) => {
            if(error){
                throw error;
            }

            const responseData = {};
            responseData["Hospital Name"] = result[0][0].name;
            responseData["Total Psychiatrist count"] = result[0][0]["Total Psychiatrist count"];
            responseData["Total patients count"] = result[1][0]["Total patients count"];
            responseData["Psychiatrist Details"] = [];
            result[2].forEach(data => {
                responseData["Psychiatrist Details"].push(data);
            });

            res.send(responseData);
        });
    } catch (error) {
        res.status(error.status || 500).send({ 
            'error': error.message 
        });
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000                                         // maximum photo size is 1MB
    },
    fileFilter(req, file, cb){                                    // cb = callback
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image!'));
        }

        cb(undefined, true);
    }
});

// Route  to create patient record
app.post('/api/addPatient', upload.single('photo') , async (req, res) => {
    try {
        const patient = await validatePatientData(req.body);

        // Converting image to png and resizing image
        if(!req.file){
            throw new Error('Please upload patient photo.');
        }

        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
        patient.photo = buffer.toString('base64');
        patient.psychiatristID = parseInt(req.body.psychiatristID);

        const sql = 'INSERT INTO patients SET ?';
        db.query(sql, patient, (err, result) => {
            if(err){
                throw err;
            }

            res.status(201).send({ 'Success': 'Patient record created successfully.'});
        });
    } catch (error) {
        res.status(error.status || 500).send({
            'error': error.message
        });
    }
}, (error, req, res, next) => {
    res.status(error.status || 500).send({
        'error': error.message
    });
});

// Global error handling
app.use((req, res, next) => {
    next(generateError('This route does not exists.', 404));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).send({ 'error': err.message });
});

app.listen(port, () => {
    console.log('Server is up on port', port);
});