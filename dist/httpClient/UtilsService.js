"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UtilsService {
    // a mettre dans la lib utils
    static resultToObjWEmptyError(message) {
        return (dataResult) => {
            if (dataResult.code == 200) {
                if (dataResult.response && dataResult.response.length > 0) {
                    return Promise.resolve(dataResult.response[0]);
                }
                else {
                    throw new Error(`${message} : empty response`);
                }
            }
            else {
                throw new Error(`${message} : ${dataResult.message}`);
            }
        };
    }
    static resultToObj(message) {
        return (dataResult) => {
            if (dataResult.code == 200) {
                if (dataResult.response && dataResult.response.length > 0) {
                    return Promise.resolve(dataResult.response[0]);
                }
                else {
                    return Promise.resolve(null);
                }
            }
            else {
                throw new Error(`${message} : ${dataResult.message}`);
            }
        };
    }
    static resultToArr(message) {
        return (dataResult) => {
            if (dataResult.code == 200) {
                if (dataResult.response && dataResult.response.length > 0) {
                    return Promise.resolve(dataResult.response);
                }
                else {
                    return Promise.resolve([]);
                }
            }
            else {
                throw new Error(`${message} : ${dataResult.message}`);
            }
        };
    }
    static resultToArrWEmptyError(message) {
        return (dataResult) => {
            if (dataResult.code == 200) {
                if (dataResult.response && dataResult.response.length > 0) {
                    return Promise.resolve(dataResult.response);
                }
                else {
                    throw new Error(`${message} : empty response`);
                }
            }
            else {
                throw new Error(`${message} : ${dataResult.message}`);
            }
        };
    }
}
exports.UtilsService = UtilsService;
//# sourceMappingURL=UtilsService.js.map