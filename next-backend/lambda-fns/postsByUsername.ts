
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

async function postsByUsername(username: string) {
  const params = {
    TableName: process.env.POST_TABLE,
    IndexName: 'postsByUsername',
    KeyConditionExpression: '#owner = :username',
    ExpressionAttributeNames: { '#owner': 'owner' },
    ExpressionAttributeValues: { ':username': username },
  }

  try {
      const data = await docClient.query(params).promise()
      return data.Items
  } catch (err) {
      console.log('DynamoDB error: ', err)
      return null
  }
}

export default postsByUsername