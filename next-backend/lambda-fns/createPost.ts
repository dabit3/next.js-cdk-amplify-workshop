const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import Post from './Post'

async function createPost(post: Post, username: string) {
    const postData = { ...post, owner: username }
    const params = {
        TableName: process.env.POST_TABLE,
        Item: postData
    }
    try {
        await docClient.put(params).promise();
        return postData;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default createPost;