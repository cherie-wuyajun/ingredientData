// index.js
var toHashKey = require('./StringUtils.js');

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const router = express.Router();
const app = express()
const AWS = require('aws-sdk');

const INGREDIENT_TABLE = process.env.INGREDIENT_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb;
configureLocalDDB();

/* Configure local dynamoDB. */
function configureLocalDDB() {
  if (IS_OFFLINE === 'true') {
    dynamoDb = new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    });
    console.log(dynamoDb);
  } else {
    dynamoDb = new AWS.DynamoDB.DocumentClient();
  }
}

app.use(bodyParser.json({ strict: false }));

/* GET home page. */
router.get('/', function (req, res) {
  res.send('welcome to ingredient data service')
});

/* PUT Ingredients. */
router.put('/add-ingredients', function (req, res) {
  for (const ingredient in req.body) {
    const text = req.body[ingredient]["text"];
    const tags = req.body[ingredient]["tags"];
    if (typeof ingredient !== 'string') {
      res.status(400).json({ error: '"ingredientName" must be a string' });
    } else if (typeof text !== 'string') {
      res.status(400).json({ error: '"text" must be a string'});
    } else if (typeof tags !== 'object') {
      res.status(400).json({ error: '"tags" must be an object' });
    }

    const params = {
      TableName: INGREDIENT_TABLE,
      Item: {
        ingredientName: ingredient,
        text: text,
        tags: tags,
      }
    };
    dynamoDb.put(params, (error) => {
      if (error) {
        console.log(error);
        res.status(400).json({ error: 'Failed creating ingredient' });
      }
    });
  }
  res.status(200).json({ message: req.body});
});

/*GET Ingredient. */
router.get('/ingredient/:ingredientName', function (req, res) {
  const params = {
    TableName: INGREDIENT_TABLE,
    Key: {
      ingredientName: req.params.ingredientName,
    },
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: "Could not get ingredient with " + params });
    }
    if (result.Item) {
      const {ingredientName, text,tags} = result.Item;
      res.json({ingredientName, text,tags});
    } else {
      res.status(404).json({ error: "Ingredient not found" });
    }
  });
});

/*GET Ingredient with fuzzy search. */
router.get('/fuzzy-search/:ingredientName', function (req, res) {
  const params = {
    TableName: INGREDIENT_TABLE,
    Key: {
      ingredientName: req.params.ingredientName.toHashKey(),
    },
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: "Could not get ingredient with " + params });
    }
    if (result.Item) {
      const {ingredientName, text,tags} = result.Item;
      res.json({ingredientName, text,tags});
    } else {
      res.status(200).json({ });
    }
  });
});


/* UPDATE Ingredients. */
router.put('/update-ingredient', function (req, res) {
  const ingredient=Object.keys(req.body)[0];
  const tags = req.body[ingredient]["tags"];
  if (typeof ingredient !== 'string') {
    res.status(400).json({ error: '"ingredientName" must be a string' });
  } else if (typeof tags !== 'object') {
    res.status(400).json({ error: '"tags" must be an object' });
  }
  const params = {
      TableName: INGREDIENT_TABLE,
      Key:{
        ingredientName: ingredient,
      },
      UpdateExpression: "SET tags=tags + :q",
      ExpressionAttributeValues: {
        ":q": tags
      },
      ReturnValues: "UPDATED_NEW"
    };

    dynamoDb.update(params, (error,result) => {
      if (error) {
        console.log(error);
        res.status(400).json({ error: 'Failed updating ingredient' });
      }
      if (result.Item) {
        const {ingredientName, text,tags} = result.Item;
        res.status(200).json({ingredientName, text,tags});
      }
    });
});

module.exports = router;
