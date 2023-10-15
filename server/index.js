const express = require('express');
const app = express();
const http = require('http');
const port = 4000;

const cors = require('cors');
app.use(cors());
app.use(express.static('public'));

const db = require('./models');
// ASSOCIATIONS
db.Feeding.belongsTo(db.Pet, { foreignKey: 'petId'});
db.Feeding.belongsTo(db.Treat, { foreignKey: 'treatId'});
db.sequelize.sync().then(res => {
    console.log('db is ready');
}).catch(e => {
    console.error('db error', e)
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        let baseName = path.basename(file.originalname, ext).replaceAll(' ', '_');
        const uniqueSuffix = `${Date.now()}-${Math.random() * 1E9}${ext.toLocaleLowerCase()}`;
        cb(null, `${baseName}-${uniqueSuffix}`);
    }
})
const uploadMiddleware = multer({
    storage,
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname).toLocaleLowerCase();
        let validexts = ['.png', '.jpg', '.gif', '.jpeg'];
        if (!validexts.includes(ext)) {
            return cb(new Error('Invalid filetype. Valid includes png, jpg, gif, jpeg'));
        }
        cb(null,true);
    },
    limits: {
        fileSize: 1024 * 8000,
    },
});

/**
 * TODO: look into getting rid of this long raw sql statement
 * maybe sub queries???
 * https://sequelize.org/docs/v6/other-topics/sub-queries/
 * still have to use raw sql in literal though...
 */
app.get('/api/pets', async (req, res, next) => {
    let today = new Date().toLocaleDateString();
    // previous long raw sql query that the above replaced... for reference
    try {
        const [pets, metadata] = await db.sequelize.query(`
        SELECT
            pets.*,
            CASE WHEN agg.totalAmount IS NULL THEN 0 ELSE agg.totalAmount END as totalAmount,
            CASE WHEN agg.totalCalories IS NULL THEN 0 ELSE agg.totalCalories END as totalCalories
        FROM pets
        LEFT JOIN
        (
            SELECT 
                feedings.petId,
                feedings.treatId,
                SUM(feedings.amount) as totalAmount,
                SUM(feedings.amount * treats.calories) as totalCalories
            FROM 
                feedings
            INNER JOIN pets ON
                feedings.petId=pets.id
            INNER JOIN treats ON
                feedings.treatId = treats.id
            WHERE
                feedings.date = "${today}"
            GROUP BY
                feedings.petId
        ) as agg ON pets.id = agg.petId;`);
        res.status(200).json({message: 'success', data: pets })
    } catch (err) {
        console.log(err)
        res.status(400).send('something wrong')
    }
});

app.get('/api/treats', async (req, res, next) => {
    try {
        let response = await db.Treat.findAll();
        res.status(200).json({
            message: 'success',
            data: response,
        })

    } catch (e) {
        res.json({ status: 400, message: 'something wrong'})
    }
})

app.delete('/api/treats/:id', async (req, res, next) => {
    try {
        let treat = await db.Treat.findOne({ where: {id : req.params.id}})
        if (treat) {
            await treat.destroy();
            res.status(201).json({ message: 'successfully deleted'});
        } else {
            res.status(400).send('Treat id not found')
        }
    } catch (err) {
        console.error(err)
        res.status(400).send('something wrong')
    }
})

app.post('/api/treats', async (req, res, next) => {
    let { name, desc, cals } = req.body;
    let date = new Date().toLocaleDateString();

    try {
        await db.Treat.create({
            name,
            date,
            description: desc,
            calories: cals,
        });
        res.status(201).json({
            message: 'success!'
        });
    } catch (err) {
        res.json({
            status: 400,
            message: 'error somewhere'
        });
    }
})

app.put('/api/treats/:id', async (req, res) => {
    let { name, desc, cals } = req.body;
    try {
        let treat = await db.Treat.findOne({ where: {id: req.params.id}});
        if (treat) {
            treat.set({
                name,
                description: desc,
                calories: cals
            });
            await treat.save();
            res.status(201).json({ message: 'updated!'})
        } else {
            // no treat found with this id
            res.status(401).send('No treat found with id: ', req.params.id);
        }
    } catch (err) {
        console.log(err);
        res.status(400).send('something wrong');
    }
    

})

app.post('/api/pets/feed', async (req, res) => {
    let { petId, treatId, amount } = req.body;
    let date = new Date().toLocaleDateString();
    try {
        await db.Feeding.create({
            petId,
            treatId,
            amount,
            date,
        });
        res.status(201).json({
            message: 'success!'
        })
    } catch (err) {
        console.error(err);
        res.json({ status: 400, message: 'oops!' });
    }
})

app.post('/api/pets', uploadMiddleware.single('pic'), async (req, res) => {
    let {name, description, weight } = req.body;
    let pic = req.file?.path?.replace('public', '') || null;
    let date = new Date().toLocaleDateString();
    try {
        await db.Pet.create({
            name,
            description,
            weight,
            pic,
            date,
        });
        res.status(201).json({ message: 'success'})
    } catch (err) {
        res.status(400).send('could not create pet')
    }
});

app.post('/api/pets', async (req, res, next) => {
    let { name, description, weight } = req.body;
    let picPath = req.file?.path?.replace('public', '') || '';
    try {
        await db.Pet.create({ 
            name,
            description,
            weight,
            pic: picPath,
        });
        res.json({ message: 'success'});
    } catch (err) {
        console.error(err);
        res.json({
            status: 400,
            message: 'Could not save pet'
        });
    }
});

// Default response for any other request
app.get('*', function(req, res) {
    res.status(404).send('Nothing to see here...')
})

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`app listening on port ${port}`);
});