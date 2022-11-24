const express = require('express');
const app = express();
const http = require('http');
const port = 4000;

const cors = require('cors');
app.use(cors());

const db = require('./database');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const util = require('util');
const getPromisified = util.promisify(db.get.bind(db));
const allPromisified = util.promisify(db.all.bind(db));

app.get('/api/pets', async (req, res, next) => {

    // just awful long sql statement to add total calories and num treats eaten per pet
    let getPetsAggregated = `
        SELECT
            pets.*,
            CASE WHEN agg.totalAmount IS NULL THEN 0 ELSE agg.totalAmount END as totalAmount,
            CASE WHEN agg.totalCalories IS NULL THEN 0 ELSE agg.totalCalories END as totalCalories
        FROM pets
        LEFT JOIN
        (
            SELECT 
                feedings.pet,
                feedings.treat,
                SUM(feedings.amount) as totalAmount,
                SUM(feedings.amount * treats.calories) as totalCalories
            FROM 
                feedings
            INNER JOIN pets ON
                feedings.pet=pets.id
            INNER JOIN treats ON
                feedings.treat = treats.id
            GROUP BY
                feedings.pet
        ) as agg ON pets.id = agg.pet
    `;

    db.all(getPetsAggregated, [], (err, rows) => {
        if (err) {
            res.status(400).json({'error': err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows,
        })
    })
});

app.get('/api/treats', (req, res, next) => {
    let sql = 'select * from treats';
    let params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({'error': err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows,
        })
    })
});

app.delete('/api/treats/:id', (req, res, next) => {
    let id = req.params.id;
    let sql = `DELETE FROM treats WHERE id='${id}'`;
    db.run(sql, (err) => {
        if (err) {
            console.log('could not delete: ', id);
            res.status(400)
        } else {
            res.json({
                message: 'success',
            });

        }
    })
});

app.post('/api/treats', (req, res, next) => {
    let treat = req.body;
    let sql = `INSERT INTO treats (
        name, description, calories
    ) VALUES (?,?,?)`;
    db.run(sql, [treat.name, treat.desc, treat.cals], (err) => {
        if (err) {
            console.log('something went wrong with POST')
            res.status(400);
        } else {
            res.json({
                message: 'success'
            })
        }
    });
});

app.put('/api/treats/:id', (req, res) => {
    let treat = req.body;
    let sql = `UPDATE treats
        SET name = ?,
            description = ?,
            calories = ?
        WHERE id = ?`;
    db.run(sql, [treat.name, treat.desc, treat.cals, req.params.id],(err) => {
        if (err) {
            console.log('something went wrong with PUT');
            res.status(400);
        }
        res.json({
            message: 'success',
        });
    });
});

app.post('/api/pets/feed', async (req, res) => {
    let body = req.body;
    let row = await getPromisified('SELECT DATE()');
    let date = row['DATE()'];
    let sql = `INSERT INTO feedings (date, pet, treat, amount)
                VALUES (?,?,?,?)`;
    db.run(sql, [date, body.petId, body.treatId, body.amount], (err) => {
        if (err) {
            console.log('couldnt feed!')
            res.status(400)
        }
        res.json({ message: 'success' })
    })     
})

// Default response for any other request
app.get('*', function(req, res) {
    res.status(404).send('Nothing to see here...')
})






const server = http.createServer(app);
server.listen(port, () => {
    console.log(`app listening on port ${port}`);
});