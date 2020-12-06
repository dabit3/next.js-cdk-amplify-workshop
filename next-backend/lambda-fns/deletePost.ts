const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function deletePost(postId: String) {
    const params = {
        TableName: process.env.POST_TABLE,
        Key: {
          id: postId
        }
    }
    try {
        await docClient.delete(params).promise()
        return postId
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default deletePost;