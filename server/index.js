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

// init db
console.log('initting db')

app.get('/test', (req, res, next) => {
    console.log('hey there dude')   
})

app.get('/api/pets', (req, res, next) => {
    let sql = 'select * from pets';
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
    console.log('treat: ', treat)
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

// Default response for any other request
app.get('*', function(req, res) {
    res.status(404).send('Nothing to see here...')
})






const server = http.createServer(app);
server.listen(port, () => {
    console.log(`app listening on port ${port}`);
});