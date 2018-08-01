using System;
using System.Text;
using System.Security.Cryptography;
using System.IO;
using System.Net;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Linq;
using System.Net.Http;

namespace c_
{
    class Program
    {
        static void Main(string[] args)
        {

            var method = "POST";
            var service = "execute-api";
            var host = "wcet7ndu1j.execute-api.ap-northeast-1.amazonaws.com";
            var region = "ap-northeast-1";
            var endpoint = "https://wcet7ndu1j.execute-api.ap-northeast-1.amazonaws.com/test/auth/login";
            // var request_parameters = "token=eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.Gz6g0kZBathOVSCeaia_5fNDF85jYGt6pO8XqDwy206f9SSzdH_0Yuomgh_lr-vMTvuPNhwq4tFsDFlKU65O0XeF5BFn7vGi7xoSgzPAmbA17v8saWaV9iai2Ox9Zc9DMMPHt-SS1OL71FSHouzL65QxrY_W9ISbNlDxTpg5ZK8ZBejVcVQjjoDiJwwOCEL0ekO8dBOqSmMQuY6FRX0oIaVec2wjp6ZW9Ok0wJhuFn6pSX2Q6VCfJdS1QYiS3U8P58oFEpfk3a-53iRM9SK2OO-ipArbk-H481XHgrXYgFbuV7tt4cQO5cdvf763TgQorTIKPSOw_f9vVUZKnFHoFQ.aE98Gb1zEt1vxVk7.KtFFpmIX1xsTDIU4ifwrkLw6BmEHGTNIZZNLhJ4kSuv1YTHdJJheZbyayL6yQ3nAqWChAVZWARK2pDs5Hk2c-AskDiXnkHYEfgqyz13UwZLk9Oi8OYmfuiKJcmrqa6AHBqcAoTkBtXjw0CgtYRdQ1-6so4fYLAwbWWLFNQfQVJV1ieXX0Ya7Fv-T1qfAsSPWMyRc3o8LnkAm9gBJOgIAIS-A3UBTt2oRc1AflFztHEnYtEPWDk_vqvq_loBWgQPMGjdiJflPIKF6Z-qv4QTdxZN_IKbVq7hTvl626c-FRr07YSGbOA0AYoGb-fL9_OhwfeylHgtpDX9dlZ0AvpwCdWHO90YbD10ljAB31xGfQlgBqIhwwy4TknSQD1L-Bk-kg2CVpd5WaBO1Ezho_XuaRukARaEunXEft_BV3QsrUwBJRhCm2Yz0RTG51yP7FVgDD4AXK-xWuKHxqU-PF9V43xv-UrmDyoxE079_KONt0c-8Sbob8lVTIWllx0NjtKQiIe3ky0G5A94zHaWshZvnDyyAOB4Bsl1q3PXLVdbRtoGtG_6pAtG4RwS2rHe7G2FI-yMcFJNV4l8e9TwNTSwlLc6C8WRy_7JGeRVdFf8_P6TYSJoRWArPJNmClUWFhDHnB1I7NpidrU6NlVmm1P2pq4pUDLlEZ9ntOeoHh46PfaxYuNJxyluTbqIc2eBGpZF13p4T2o4fzovxdMzaxFjDi_l2cXTucZUP7H-kj822u1Lwc-0AhPhW7vqzlEeIyruUbUtXTDoH-w6zsvcZlfms-53DhefwzIwqXR8MRJ9_kbVbdXqRCZc7bH-sK8mZfkgo7X21FD-mn6Nm3BYvmXxGT9n850Pxx1D5egAEJ_CQY2g0_aXnQY9YP2yLnZs8YkCO1P-yYzSBZ-aDqfWxYjq76ZAYcF6Wh-_n_6LjgfWVLXKBl6rI75Ij21OX7ZbJztgJMfrIGDZOvUPEiz_5pCP48Rbe2MNrEwcDNj5EYoqy6frPiHje7C3riC7gea8tWUjrI-8fNGIyLD7j9RNL3KuhCUUM1ydY9TnEaaryvSqLgaAfcCSykQOPkp66f7cI1eDbpXo4LeduiPjoIokaV1Kxr5IL4h-b1tlJOq4ZHkr43Ehasiwb9UbRKbr5qZPbtLNwgX5qRu9_jMOOoxR_BKXK7u87dsIZEZkfVCbAgh8XOrf1oIkLfDBbXZTzVCJ5GoZGYwLK2Fvn5ep0SjD_rwOLc2Dlb_L4ZLE3v03UkTMOx5L8YMgqqKPkkAhv9ipS4h_XInTQiyiF1FEfRI4V7gw6bA.1y_4kMo7XX6Tu23siVKMWQ";
            var request_parameters = "";

            var access_key = "AKIAJCRLXQX2J6OKN4GQ";
            var secret_key = "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";

            //Create a date for headers and the credential string
            var t = DateTime.Now.AddHours(-9);
            var amzdate = t.ToString("yyyyMMddTHHmmssZ");
            var datestamp = t.ToString("yyyyMMdd");

            var canonical_uri = "/test/auth/login";
            var canonical_querystring = request_parameters;
            var canonical_headers = "accept:" + "application/json" + "\n" + "host:" + host + "\n" + "x-amz-date:" + amzdate + "\n";

            var signed_headers = "accept;host;x-amz-date";

            var json_payload = "{ \"id\" :\"19999-99999-46884-67157\",\"hash\":\"AQICAHjR51bc1D08qnccIQbPUgRJgcSkAEg1UpJeaQ9V0F8f+QGWzYh813GeXh8ss46LYO2+AAAAdTBzBgkqhkiG9w0BBwagZjBkAgEAMF8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM94Oh5b1xem/QrCtBAgEQgDKePB/SsQMCAdgjS+cQ9HYdCUvQ5Vd5+oXZsqgjL4qLP7OdCGEl62cmXXw1NGS+9W9jhw==\"}";

            var payload_hash = hexdigest(json_payload);

            var canonical_request = method + "\n" + canonical_uri + "\n" + canonical_querystring + "\n" + canonical_headers + "\n" + signed_headers + "\n" + payload_hash;
            Console.WriteLine("anonical_request:" + canonical_request);
            var algorithm = "AWS4-HMAC-SHA256";
            var credential_scope = datestamp + "/" + region + "/" + service + "/" + "aws4_request";
            var string_to_sign = algorithm + "\n" + amzdate + "\n" + credential_scope + "\n" + hexdigest(canonical_request);

            var signing_key = getSignatureKey(secret_key, datestamp, region, service);
            var signature = BitConverter.ToString(HmacSHA256(string_to_sign, signing_key)).Replace("-", "").ToLower();
            var authorization_header = algorithm + ' ' + "Credential=" + access_key + "/" + credential_scope + ", " + "SignedHeaders=" + signed_headers + ", " + "Signature=" + signature;

            Console.WriteLine("string_to_sign:" + string_to_sign);

            var request_url = endpoint + '?' + canonical_querystring;

            byte[] postDataBytes = System.Text.Encoding.ASCII.GetBytes(json_payload);

            try
            {
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(endpoint);
                req.Method = "POST";
                req.Headers.Add("accept", "application/json");
                req.Headers.Add("Authorization", authorization_header);
                req.Headers.Add("x-amz-date", amzdate);
                req.ContentLength = postDataBytes.Length;



                Console.WriteLine("x-amx-date: " + amzdate);
                Console.WriteLine("Authorization: " + authorization_header);
                System.IO.Stream reqStream = req.GetRequestStream();
                reqStream.Write(postDataBytes, 0, postDataBytes.Length);
                reqStream.Close();

                HttpWebResponse res = (HttpWebResponse)req.GetResponse();


                Stream s = res.GetResponseStream();
                StreamReader sr = new StreamReader(s);
                string content = sr.ReadToEnd();

                Console.WriteLine(content);
                Console.WriteLine(res.StatusCode);
                sr.Close();
                s.Close();
            }catch(Exception ex){
                Console.WriteLine(ex.Message);
            }
        }

        static byte[] HmacSHA256(String data, byte[] key)
        {
            String algorithm = "HmacSHA256";
            KeyedHashAlgorithm kha = KeyedHashAlgorithm.Create(algorithm);
            kha.Key = key;

            return kha.ComputeHash(Encoding.UTF8.GetBytes(data));
        }

        static string hexdigest(string msg)
        {
            var sh = SHA256.Create();
            return BitConverter.ToString(sh.ComputeHash(Encoding.UTF8.GetBytes(msg))).Replace("-", "").ToLower();
        }

        static byte[] getSignatureKey(String key, String dateStamp, String regionName, String serviceName)
        {
            byte[] kSecret = Encoding.UTF8.GetBytes(("AWS4" + key).ToCharArray());
            byte[] kDate = HmacSHA256(dateStamp, kSecret);
            byte[] kRegion = HmacSHA256(regionName, kDate);
            byte[] kService = HmacSHA256(serviceName, kRegion);
            byte[] kSigning = HmacSHA256("aws4_request", kService);

            return kSigning;
        }
    }


}
