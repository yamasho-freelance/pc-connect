using System;
using System.Text;
using System.Security.Cryptography;
using System.IO;
using System.Net;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Linq;
using Amazon.KeyManagementService;
using Amazon.Runtime;
using System.Net.Http;
using Amazon.Runtime.CredentialManagement;
using Amazon.KeyManagementService.Model;
using Amazon;

namespace kms
{
    class ksm
    {
        static void Main(string[] args)
        {
            // string accessKey = "AKIAJCRLXQX2J6OKN4GQ";
            // string seacretKey = "29XQBOyGZwkgXcW/4yylTdzWu2Hv95EyKq/lwmN0";
            // string keyID = "0022d1d9-f0c7-45e1-8f84-2b77c6fdcba9";
            // var kms = new AmazonKeyManagementServiceClient(accessKey, seacretKey, Amazon.RegionEndpoint.APNortheast1);
            // var encReq = new EncryptRequest();
            // encReq.KeyId = keyID;
            // encReq.Plaintext = new MemoryStream(Encoding.UTF8.GetBytes("19999-99999-46884-67157"));

            // var encrypt = kms.EncryptAsync(encReq);
            // System.Console.WriteLine(System.Convert.ToBase64String(encrypt.Result.CiphertextBlob.ToArray()));
            // var base64Str = System.Convert.ToBase64String(encrypt.Result.CiphertextBlob.ToArray());
            // var decReq = new DecryptRequest();
            // decReq.CiphertextBlob = new MemoryStream(System.Convert.FromBase64String(base64Str));
            // var decrypt = kms.DecryptAsync(decReq).Result;
            // System.Console.WriteLine(Encoding.UTF8.GetString(decrypt.Plaintext.ToArray()));

            string accessKey = "AKIAJCRLXQX2J6OKN4GQ";
            string seacretKey = "29XQBOyGZwkgXcW/4yylTdzWu2Hv95EyKq/lwmN0";
            string keyID = "0022d1d9-f0c7-45e1-8f84-2b77c6fdcba9";
            var str = "18310-73899-78639-52683";
            var kmsc = new AmazonKeyManagementServiceClient(accessKey, seacretKey, Amazon.RegionEndpoint.APNortheast1); //(アクセスキー、シークレットキー、リージョンよりクライアント作成)
            var plaintext = new MemoryStream(Encoding.UTF8.GetBytes(str));
            EncryptRequest encryptRequest = new EncryptRequest() //(暗号化リクエストを作成)
            {
                KeyId = keyID, //(頂いたKeyId を代入 "0022d1d9-f0c7-45e1-8f84-2b77c6fdcba9")
                Plaintext = plaintext
            };
            var ciphertext = kmsc.EncryptAsync(encryptRequest).Result.CiphertextBlob; //(kmsc は上記クライアント)
            System.Console.WriteLine(Convert.ToBase64String(ciphertext.ToArray()));

        }
    }


}
