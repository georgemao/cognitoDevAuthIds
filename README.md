# cognitoDevAuthIds
Example how to implement the Cognito Developer Authenticated Identity Flow

You should use the Developer Authenticated flow when:
1. You plan to use your own data store to maintain your user database
2. You want integrate with Cognito so you can vend AWS Credentials for your users

## Running the example

This is setup as a SAM project that you can execute with the following command:

```
sam local invoke authFn -e "event.json"
```

## Steps

![alt text](https://docs.aws.amazon.com/cognito/latest/developerguide/images/amazon-cognito-dev-auth-enhanced-flow.png "Flow")

1. Your users will authenticate against your existing user directory. Your application will handle this.
2. When the user successfully authenticates, your application will invoke the [Cognito API](https://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_GetOpenIdTokenForDeveloperIdentity.html): **getOpenIdTokenForDeveloperIdentity** 
This API will vend an OIDC (JWT format) token that you can exchange for temporary AWS credentials

You will need to pass it parameters in this format:

```js
  var params = {
    IdentityPoolId: '[region]:[id pool GUID]', /* required */
    Logins: { /* required */
      '[unique identifier for your app]': '[unique username]',
    }
  };
```
This call will return an **IdentityId** and **Token** which you will pass into the call to exchange for AWS credentials.

3. Exchange the token for AWS credentials using **getCredentialsForIdentity**. Cognito will assign the user a role based on the rules you have configured in your Identity Pool.

You will need to pass it credentials in this format:

```js
  var params = {
    IdentityId: [IdentityId], /* required */
    Logins: {
      'cognito-identity.amazonaws.com': [Token]
    }
  };
 ```
 
 This call will return temporary credentials in this format:
 
 ```js
 {
	IdentityId: '',
	Credentials: {
		AccessKeyId: '',
		SecretKey: '',
		SessionToken: '',
		Expiration: 
	}
}
```

## Notes
- You must invoke the **getOpenIdTokenForDeveloperIdentity** API using AWS Developer credentials with permissions: cognito-identity:GetOpenIdTokenForDeveloperIdentity
- **getCredentialsForIdentity** is a public API. You do not need any credentials to call this API
- [See AWS Docs for details](https://docs.aws.amazon.com/cognito/latest/developerguide/developer-authenticated-identities.html)
