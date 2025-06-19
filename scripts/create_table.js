const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB({
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://dynamodb-local:8000',
  region: 'us-east-1',
  accessKeyId: 'fakeAccessKey',
  secretAccessKey: 'fakeSecretKey',
});
const tableName = 'Feedbacks';
const params = {
  TableName: tableName,
  KeySchema: [{ AttributeName: 'Id', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'Id', AttributeType: 'S' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

dynamodb.createTable(params, (err, data) => {
  if (err) {
    if (err.code === 'ResourceInUseException') {
      console.log(`Table ${tableName} already exists.`);
    } else {
      console.error(`Error on create table ${tableName}:`, err);
    }
  } else {
    console.log(`Table ${tableName} created successfully:`, data);
  }
});
