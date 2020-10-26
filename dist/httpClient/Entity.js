"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongo = require("mongodb");
class Entity {
    static cast(obj, castChildClass = false) {
        if (obj._id) {
            obj._id = new mongo.ObjectId(obj._id);
        }
    }
    static check(target, isCompleteObj = true, path = "") {
        return [];
    }
    static castQueryParam(path, value) {
        if (value === null) {
            return null;
        }
        switch (path) {
            case '_id':
                return new mongo.ObjectId(value);
                break;
            case '_class':
                return new String(value).valueOf();
                break;
            default:
                return value;
                break;
        }
    }
    static getClassNameOfProp(path) {
        return null;
    }
}
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map