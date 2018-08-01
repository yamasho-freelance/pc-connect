import aws from "aws-sdk";
aws.config.region = "ap-northeast-1";
aws.config.accessKeyId = "AKIAIN4TMWXZWUHAS3LA";
aws.config.secretAccessKey = "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";

var cog = new aws.CognitoIdentityServiceProvider();
// var params = {
//     UserPoolId: 'ap-northeast-1_srHUAjtc2', /* required */
//     Username: 'autoSignInUser', /* required */
//     TemporaryPassword: 'autoSignInUser1234'
//   };

// cog.adminCreateUser(params,(err,data)=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(data);        
//     }
// });

var params = {
    AuthFlow: "USER_SRP_AUTH",
    ClientId: '14hg9uas2k1dlffrr9ot02pvkt', /* required */
    UserPoolId: 'ap-northeast-1_srHUAjtc2', /* required */
    AuthParameters: {
      '<StringType>': 'STRING_VALUE',
      /* '<StringType>': ... */
    }
  };

cog.initiateAuth()

console.log("aaaa");
