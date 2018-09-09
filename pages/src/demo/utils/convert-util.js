
const units = [" B", " KB", " MB", " GB", " TB"];

//変換処理
export function convertToFileSize(size) {
    for (var i = 0; size > 1024; i++) {
        size /= 1024;
    }
    return Math.round(size * 100) / 100 + units[i];
}

export function convertTimestampToDisplay(timestamp) {
    if (!timestamp) { return "" }
    var result = timestamp;
    result = insertStr(result, 4, "-");
    result = insertStr(result, 7, "-");
    result = insertStr(result, 10, " ");
    result = insertStr(result, 13, ":");
    result = insertStr(result, 16, ":");
    return result;
}

export function getFilenameFromPath(path) {
    if (!path) {
        return "";
    } else {
        return path.split("/").pop().split(".").shift();
    }
}

export function getUserid() {
    return "19185";
}


export function getHashUserid() {
    return encodeURIComponent("AQICAHjR51bc1D08qnccIQbPUgRJgcSkAEg1UpJeaQ9V0F8f+QEXMVY2aF6TxVjMK/CO1o3XAAAAdTBzBgkqhkiG9w0BBwagZjBkAgEAMF8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMm0ZP9DIUwFdSoAoxAgEQgDKtmxyv5qr7C3cutxl2N+d2fhnjMlRFdIuQx68JxHLyptwobTD4glb15U7xinIFqtrVlw==")
}

function insertStr(str, index, insert) {

    return str.slice(0, index) + insert + str.slice(index, str.length);
}