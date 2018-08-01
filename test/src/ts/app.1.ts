import Amplify, { Auth, API } from "aws-amplify";
import aws, { S3 } from "aws-sdk";

window.onload = function(){

    var input_file = window.document.getElementById("madori-file");
    console.log(input_file);
    console.log(document);
    input_file.onchange=function(){
        getApi(input_file.files[0]);
    
    }
    
}

function getApi(file){
    var req = new XMLHttpRequest();
    var formData = new FormData();


    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            console.log(req.responseText);
            if (req.status === 200) {
                console.log(req.responseText);
                upload(JSON.parse(req.responseText),file);
            }
        } else {
            console.log(req);
            console.log(req.responseText);
        }
    }
    var id = "AQICAHjR51bc1D08qnccIQbPUgRJgcSkAEg1UpJeaQ9V0F8f+QGWzYh813GeXh8ss46LYO2+AAAAdTBzBgkqhkiG9w0BBwagZjBkAgEAMF8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM94Oh5b1xem/QrCtBAgEQgDKePB/SsQMCAdgjS+cQ9HYdCUvQ5Vd5+oXZsqgjL4qLP7OdCGEl62cmXXw1NGS+9W9jhw==";
    var userid = "yamasho";
    var key = file.name;
    var queryString = "?id="+encodeURIComponent(id)+"&username="+userid+"&filename="+encodeURIComponent(key);
    // queryString = encodeURIComponent(queryString);
    var url = "https://wcet7ndu1j.execute-api.ap-northeast-1.amazonaws.com/test/upload/url"+queryString
    // var url2 = "https://wcet7ndu1j.execute-api.ap-northeast-1.amazonaws.com/test/upload/url?id=AQICAHjR51bc1D08qnccIQbPUgRJgcSkAEg1UpJeaQ9V0F8f%2bQGWzYh813GeXh8ss46LYO2%2bAAAAdTBzBgkqhkiG9w0BBwagZjBkAgEAMF8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM94Oh5b1xem%2fQrCtBAgEQgDKePB%2fSsQMCAdgjS%2bcQ9HYdCUvQ5Vd5%2boXZsqgjL4qLP7OdCGEl62cmXXw1NGS%2b9W9jhw%3d%3d&filename=madori.mdzx&username=yamasho"
    req.open("GET", url,true);
    req.setRequestHeader("Authorization","eyJraWQiOiJDclJHdGp3WWZFRFUzXC9ua1lXT0VQTms3KytOQUVVYTREMWdyVWVRQU1tND0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxNzNiZGUxYy0yNjQzLTQ4NWMtOTVhYi03YzMxN2JhN2Q2MWMiLCJhdWQiOiI1dW10b3V2cmQ0bDQ5Yzl2YTJoZzBoOWo1cyIsImV2ZW50X2lkIjoiZmYyOTM2ZDMtOTRjMS0xMWU4LTkxZjktZWJjY2JlNGUzOTY0IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1MzMwNDIxNTYsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tXC9hcC1ub3J0aGVhc3QtMV9yR2Y4SFdzVlciLCJjb2duaXRvOnVzZXJuYW1lIjoiMTk5OTkiLCJjdXN0b206YmFzaWNfY291bnQiOiI4IiwiZXhwIjoxNTMzMDQ1NzU2LCJjdXN0b206YnVzaW5lc3NfY291bnQiOiI0IiwiaWF0IjoxNTMzMDQyMTU2fQ.dpO8rcnATnMAByGi4IesNBHsOgSYad_I-g0zmeSjOFZneep2PhrgFMjA2LahT0roCbAGPAhjTVHeWwzFnTRktncGso-W2axsutW9aIdh6k0DCPVdVaUhLwvAErsbkamrChXQUSS0auk-k_PtaMtO73ML8wKN912bPPC0anfteltoTvyPb1FdE1325aB2oqCWK1LL3BOCGBh_oOuA6y_YrlSXEKhTgcRnpFc5rhzqNJcKz9ACgiDWWmo2-Qib9ZqUlyi-14brpp6yoM8lg5vhmgfqyAKjklXd59wTFW_EM0l9mpkvKG8FanR6TNefIIi5Dwm9ptGllKW_yZ6xP91rYA");
    req.setRequestHeader("content-type","application/json");
    req.send();
}


function upload(res,file){
    var req = new XMLHttpRequest();
    var formData = new FormData();

    for (var key in res.fields) {
        formData.append(key, res.fields[key]);
    }
    formData.append("file",file);

    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            console.log(req.responseText);
            if (req.status === 200) {
                console.log(req.responseText);
            }
        } else {
            console.log(req);
            console.log(req.responseText);
        }
    }
  
    // var url2 = "https://wcet7ndu1j.execute-api.ap-northeast-1.amazonaws.com/test/upload/url?id=AQICAHjR51bc1D08qnccIQbPUgRJgcSkAEg1UpJeaQ9V0F8f%2bQGWzYh813GeXh8ss46LYO2%2bAAAAdTBzBgkqhkiG9w0BBwagZjBkAgEAMF8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM94Oh5b1xem%2fQrCtBAgEQgDKePB%2fSsQMCAdgjS%2bcQ9HYdCUvQ5Vd5%2boXZsqgjL4qLP7OdCGEl62cmXXw1NGS%2b9W9jhw%3d%3d&filename=madori.mdzx&username=yamasho"
    req.open("POST", res.url,true);

    
    req.send(formData);
}