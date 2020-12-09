const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import getPostById from './getPostById';

type Params = {
  TableName: string | undefined,
  Key: string | {},
  ExpressionAttributeValues: any,
  ExpressionAttributeNames: any,
  UpdateExpression: string,
  ReturnValues: string
}

async function updatePost(post: any, username: string) {
  const original = await getPostById(post.id);
  if (original.owner !== username) {
    throw new Error('User not authorized to make this request');
  }
  let params : Params = {
    TableName: process.env.POST_TABLE,
    Key: {
      id: post.id
    },
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
    UpdateExpression: "",
    ReturnValues: "UPDATED_NEW"
  };
  let prefix = "set ";
  let attributes = Object.keys(post);
  for (let i=0; i<attributes.length; i++) {
    let attribute = attributes[i];
    if (attribute !== "id") {
      params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
      params["ExpressionAttributeValues"][":" + attribute] = post[attribute];
      params["ExpressionAttributeNames"]["#" + attribute] = attribute;
      prefix = ", ";
    }
 }
  console.log('params: ', params)
  try {
    await docClient.update(params).promise()
    return post
  } catch (err) {
    console.log('DynamoDB error: ', err)
    return null
  }
}

export default updatePost;