class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

// now I can extend

class MadoriError extends ExtendableError {
    constructor(message) {
        super("MadoriError: " + message);
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

class GeneralSrverError extends ExtendableError {
    constructor(err, message) {
        super("GeneralServerError: " + message);
        this.name = err.name;
        this.stack = err.stack;

    }
}

module.exports.MadoriError = MadoriError;
module.exports.GeneralSrverError = GeneralSrverError;
