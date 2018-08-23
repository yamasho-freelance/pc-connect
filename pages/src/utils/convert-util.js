
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
    var match = location.search.match(/userid=(.*?)(&|$)/);
    if (match.length >= 0) {
        return match[1];
    }
}


export function getHashUserid() {
    var match = location.search.match(/hash=(.*?)(&|$)/);
    if (match.length >= 0) {
        return match[1];
    }
}

function insertStr(str, index, insert) {

    return str.slice(0, index) + insert + str.slice(index, str.length);
}