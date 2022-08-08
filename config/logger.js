'use strict';
const log4js = require('log4js'),
    loggerConfig = require('./loggerConfigLog4js')(log4js, config.appSettings.env);
const moment = require('moment');
const logger = loggerConfig.appLogger;
const httpRequestLogger = loggerConfig.httpRequestLogger;
const errorLogger = loggerConfig.errorLogger;
const stackTrace = require('stack-trace');
exports.log = function (msg, type) {
    if (config.appSettings.logging) {
        switch (type) {
            case "error":
                logger.error(msg);
                break;
            case "info":
                logger.info(msg);
                break;
            case "warn":
                logger.warn(msg);
                break;
            case "fatal":
                logger.fatal(msg);
                break;
        }
    }
};

exports.jsonToString = function (inputVal) {
    return JSON.stringify(inputVal);
};

exports.logintodb = function (db, req, res) {
    var collection = db.get().collection('bin_request_logger');
    var inputString = {
        "datetime": new Date(),
        "request_from": exports.req_ip(req),
        "request_params": req.params,
        "response_mesg": res
    };
    collection.insert(inputString, function (error, docs) {
        if (error) exports.log("Unable to add logs in collection", "error");
    });
};

exports.req_ip = function (req) {
    return (req.headers["X-Forwarded-For"] || req.headers["x-forwarded-for"] || req.client.remoteAddress);
};

exports.debug = function (msg) {
    return httpRequestLogger.debug(msg);
};

exports.info = function (msg) {
    let trace = stackTrace.get();
    return logger.info(msg, trace[1].getLineNumber(), trace[1].getMethodName(), trace[1].getFileName(), trace[1]);
};

exports.warn = function (msg) {
    let trace = stackTrace.get();
    return logger.warn(msg, trace[1].getLineNumber(), trace[1].getMethodName());
};

exports.fatal = function (msg) {
    let trace = stackTrace.get();
    return logger.fatal(msg, trace[1].getLineNumber(), trace[1].getMethodName());
};

exports.error = function (msg) {
    let trace = stackTrace.get();
    return logger.error(msg, trace[1].getLineNumber(), trace[1].getMethodName());
};

exports.trace = function (msg) {
    let trace = stackTrace.get();
    return logger.trace(msg, trace[1].getLineNumber(), trace[1].getMethodName());
};



