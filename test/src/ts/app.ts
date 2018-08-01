import Amplify, { Auth, API } from "aws-amplify";
import aws, { S3 } from "aws-sdk";

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


Auth.signIn("yamasho", "Yama0722")
    .then((user) => {
        console.log(user);

        let apiName = 'madori';
        let member_path = '/upload/url?username=あああ&key=山本.txt';

        //idトークンを手動でセット。本来はライブラリ側で自動でセットされるはず・・・？要調査
        let options = {
            headers: {
                Authorization: user.signInUserSession.idToken.jwtToken,
                "content-type":"application/json"
            },
            response:true,
            queryStringParameters:{
                "username":"ああああ",
                "key":"山本.txt"
            }
        };

        API.get(apiName, member_path, options)
            .then(res => {
                console.log(res);

                var req = new XMLHttpRequest();
                var formData = new FormData();

                for (var key in res.data.fields) {
                    formData.append(key, res.data.fields[key]);
                }
                formData.append("file","aaaaabbbbbbb");

                req.onreadystatechange = function () {
                    if (req.readyState === 4) {
                        if (req.status === 200) {
                            console.log(req.responseText);
                        }
                    } else {
                        console.log(req);
                    }
                }
                req.open("POST", res.data.url);
                req.send(formData);


            })
            .catch(err => {
                console.log(err);
            });
    })
    .catch((err) => {
        console.log(err);
        alert('エラーが発生しました');
        return;
    });
