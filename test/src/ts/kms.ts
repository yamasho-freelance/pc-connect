import * as aws from "aws-sdk";
import Amplify, { Auth, API } from "aws-amplify";

aws.config.region = "ap-northeast-1";

Amplify.configure({
    Auth: {
        identityPoolId: 'ap-northeast-1:b5fa0233-04f9-4d30-bc55-095a3487c19d',
        region: 'ap-northeast-1', // REQUIRED - Amazon Cognito Region
        userPoolId: 'ap-northeast-1_srHUAjtc2', //OPTIONAL - Amazon Cognito User Pool ID
        userPoolWebClientId: '14hg9uas2k1dlffrr9ot02pvkt', //OPTIONAL - Amazon Cognito Web Client ID//
    },
    API: {
        endpoints: [
            {
                name: "madori",
                endpoint: "https://jnvdhrd7f0.execute-api.ap-northeast-1.amazonaws.com/prod",
                region: "ap-northeast-1"
            }
        ]
    }
});




getCredentials().then((credentials) => {

    let kms = new aws.KMS({"credentials":credentials});
    let keyId = "93bc2dde-6218-4d49-a700-6f17f4b275da"

    let params = {
        KeyId: keyId,
        Plaintext: "あああいうえりおさｊｄｓ資格■①"
    };

    kms.encrypt(params, (err, data) => {

        if (err) {
            console.log(err);
        }
        else {
            console.log(data);
        }
        var base64String = window.btoa(String.fromCharCode.apply(null, data.CiphertextBlob));
        console.log(base64String)
        let param = {
            CiphertextBlob: data.CiphertextBlob
        }

        kms.decrypt(param, (err, data) => {
            console.log(data.Plaintext.toString());
        });
    })

});


function getCredentials() {

    return new Promise((resolve, reject) => {

        Auth.signIn("yamasho", "Yama0722")
            .then((user) => {
                console.log(user);
                let cre = createAWSCredentials(user.signInUserSession.idToken.jwtToken);
                console.log(cre);
                resolve(cre);
            })
            .catch((err) => {
                console.log(err);
                alert('エラーが発生しました');
                reject(err);
            });

    });
}

function createAWSCredentials(idToken) {
    return new aws.CognitoIdentityCredentials({
        IdentityPoolId: "ap-northeast-1:b5fa0233-04f9-4d30-bc55-095a3487c19d",
        Logins: {
            "cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_srHUAjtc2": idToken
        }
    });
}

// function getCognitoID(idToken) {
//     let cognito = new aws.CognitoIdentity();
//     let params = {
//         AccountId: "032500022239",
//         IdentityPoolId: "ap-northeast-1:b5fa0233-04f9-4d30-bc55-095a3487c19d",
//         Logins: {
//             "cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_srHUAjtc2": idToken
//         }
//     }
//     cognito.getId(params, function (err, data) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             console.log(data);

//             cognito.getCredentialsForIdentity(data, (err, data) => {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     console.log(data);
//                 }
//             })
//         }
//     });
// }
