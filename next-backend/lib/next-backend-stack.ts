import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';

export class NextBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'cdk-blog-user-pool', {
      selfSignUpEnabled: true,
      accountRecovery: cognito.AccountRecovery.PHONE_AND_EMAIL,
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE
      },
      autoVerify: {
        email: true
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true
        }
      }
    });

    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool
    });

    const api = new appsync.GraphqlApi(this, 'cdk-blog-app', {
      name: "cdk-blog-app",
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      schema: appsync.Schema.fromAsset('./graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        },
        additionalAuthorizationModes: [{
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          }
        }]
      },
    });

    const postLambda = new lambda.Function(this, 'AppSyncPostHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('lambda-fns'),
      memorySize: 1024
    });
    
    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource('lambdaDatasource', postLambda);

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getPostById"
    });
    
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "listPosts"
    });

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "postsByUsername"
    });
    
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createPost"
    });
    
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "deletePost"
    });
    
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "updatePost"
    });

    const postTable = new ddb.Table(this, 'CDKPostTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });

    postTable.addGlobalSecondaryIndex({
      indexName: "postsByUsername",
      partitionKey: {
        name: "owner",
        type: ddb.AttributeType.STRING,
      }
    })

    // enable the Lambda function to access the DynamoDB table (using IAM)
    postTable.grantFullAccess(postLambda)
    
    // Create an environment variable that we will use in the function code
    postLambda.addEnvironment('POST_TABLE', postTable.tableName);

    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl
    });

    new cdk.CfnOutput(this, 'AppSyncAPIKey', {
      value: api.apiKey || ''
    });
    new cdk.CfnOutput(this, 'ProjectRegion', {
      value: this.region
    });

    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId
    });

  }
}