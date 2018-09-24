// This example shows how to perform a DEV Identified Authentication Flow
// This Lambda function represents the custom App that is performing the Dev ID Auth Flow

// Step 1. App authenticates with own custom IDP
// Step 2. IDP calls getOpenIdTokenForDeveloperIdentity for OIDC token
// Step 3. App uses token to exchange for AWS creds
// Docs: https://docs.aws.amazon.com/cognito/latest/developerguide/developer-authenticated-identities.html
// API: https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_GetOpenIdTokenForDeveloperIdentity.html

'use strict'

var AWS  = require('aws-sdk');

var cognitoidentity = new AWS.CognitoIdentity();

exports.handler = function (event, context, callback) {
  
  // TODO: 
  // Step 1: 
  // Get Username/password and verify it from the event object
  // If valid, proceed with below, sending the Username in as the Login

  var params = {
    IdentityPoolId: 'us-west-2:2cf7f979-2607-49e4-9d2c-0d66ea8bb0e4', /* required */
    Logins: { /* required */
      'login.awsgeorge.app': 'georgemao',
    }
    //IdentityId: 'george',
  };

  // Step 2: 
  // Make this call to Cognito to get the OIDC JWT Token
  // Use AWS Developer Creds with permission to call this API
  cognitoidentity.getOpenIdTokenForDeveloperIdentity(params, function(err, data) {
    if (err) 
      console.log(err, err.stack); // an error occurred
    else{     
      console.log(data.IdentityId);
      console.log(data.Token);

      var params = {
        IdentityId: data.IdentityId, /* required */
        Logins: {
          'cognito-identity.amazonaws.com': data.Token,
        }
      };

      // Step 3:
      // Get temp AWS credentials with the token provided from Cognito
      cognitoidentity.getCredentialsForIdentity(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });
    }
  });

    
  callback(null, {"body" : "success!!!"} )
}
