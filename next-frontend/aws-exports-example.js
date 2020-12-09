import { NextBackendStack } from './cdk-exports.json'

const config = {
  aws_project_region: NextBackendStack.ProjectRegion,
  aws_user_pools_id: NextBackendStack.UserPoolId,
  aws_user_pools_web_client_id: NextBackendStack.UserPoolClientId,
  aws_appsync_graphqlEndpoint: NextBackendStack.GraphQLAPIURL,
  aws_appsync_apiKey: NextBackendStack.AppSyncAPIKey,
  aws_appsync_authenticationType: "API_KEY"
}

export default config