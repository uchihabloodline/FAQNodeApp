const fs = require('fs');
const loggerPath = config.appSettings.loggerPath; //require('./config').appSettings.loggerPath;
const format = require('date-format');
const ip = require('ip');

if (!fs.existsSync(loggerPath)) fs.mkdirSync(loggerPath);
if (!fs.existsSync(loggerPath + '/http')) fs.mkdirSync(loggerPath + '/http');
module.exports = function (log4js, category) {
    log4js.configure({
            appenders: {
                category: {
                    type: 'dateFile',
                    filename: loggerPath + '/'  + 'FaqApp.log',
                    pattern: "dd-MM-yyyy-hh",
                    alwaysIncludePattern: true,
                    layout: {type: 'json', separator: ','},
                    category  : category,
                    keepFileExt:true
                },
                access: {
                    type: 'dateFile',
                    filename: loggerPath + '/http/access.log',
                    pattern: "dd-MM-yyyy",
                    layout: {type: 'json', separator: ','},
                    keepFileExt:true,
                    category: 'http'
                },
                errorFile: {
                    type: "dateFile",
                    filename: loggerPath + "/errors.log",
                    pattern: "dd-MM-yyyy",
                    keepFileExt:true
                },
                errors: {
                    type: "logLevelFilter",
                    level: "ERROR",
                    appender: "errorFile"
                }
            },
            categories: {
                default: {appenders: ['category', 'errors','access'], level: 'DEBUG'}
            }
        },
        log4js.addLayout('json', function () {
            return function (logEvent) {
                var logData = logEvent.data[0];
                const message = {
                    'ts': format('dd-MM-yyy hh:mm:ss.SSS', (logEvent.startTime)),
                    'file': logEvent.data[3], 'fn': logEvent.data[2],
                    'line': logEvent.data[1], 'level': logEvent.level.levelStr,
                    'event': logData.event, 'pId': logData.payuId,
                    'sid': logData.socketId, 'sip': ip.address(),
                    'cip': logData.clientIp, 'msg': logData.message
                };
                return JSON.stringify(message);
            }
        }));
    let appLogger = log4js.getLogger('category');
    let httpRequestLogger = log4js.getLogger('http');
    let errorLogger = log4js.getLogger('error');
    return {appLogger, httpRequestLogger,errorLogger}
};