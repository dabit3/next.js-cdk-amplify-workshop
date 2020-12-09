const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import getPostById from './getPostById';

async function deletePost(postId: string, username: string) {
  const original = await getPostById(postId);
  if (original.owner !== username) {
    throw new Error('User not authorized to make this request');
  }
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