"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.polonaisInverse = void 0;
/* eslint-disable @typescript-eslint/ban-types */
const mongodb_1 = require("mongodb");
function polonaisInverse(req = '*', entity) {
    return Promise.resolve().then(() => {
        const operators = {
            $date: function (stackArr) {
                if (stackArr.length < 1) {
                    throw new Error(' $date operator require 1 args');
                }
                else {
                    const value = stackArr.pop();
                    stackArr.push(new Date(value));
                }
            },
            $num: function (stackArr) {
                if (stackArr.length < 1) {
                    throw new Error(' $num operator require 1 args');
                }
                else {
                    const value = stackArr.pop();
                    stackArr.push(new Number(value).valueOf());
                }
            },
            $bool: function (stackArr) {
                if (stackArr.length < 1) {
                    throw new Error('$bool operator require 1 args');
                }
                else {
                    const value = stackArr.pop();
                    let castValue;
                    if (value !== null && value !== undefined && value.toString) {
                        if (value.toString().toLowerCase() === 'true' ||
                            value.toString() === '1') {
                            castValue = true;
                        }
                        else if (value.toString().toLowerCase() === 'false' ||
                            value.toString() !== '1') {
                            castValue = false;
                        }
                    }
                    else {
                        castValue = new Boolean(value).valueOf();
                    }
                    stackArr.push(castValue);
                }
            },
            $objectId: function (stackArr) {
                if (stackArr.length < 1) {
                    throw new Error('$objectId operator require 1 args');
                }
                else {
                    const value = stackArr.pop();
                    try {
                        stackArr.push(new mongodb_1.ObjectId(value));
                    }
                    catch (err) {
                        throw new Error('value ' + value + 'is not an ObjectId');
                    }
                }
            },
            $null: function (stackArr) {
                stackArr.push(null);
            },
            '=': function (stackArr) {
                if (stackArr.length < 2) {
                    throw new Error('= operator require 2 args');
                }
                else {
                    const value = stackArr.pop();
                    const field = stackArr.pop();
                    const obj = {};
                    obj[field] = { $eq: entity.castQueryParam(field, value) };
                    stackArr.push(obj);
                }
            },
            '!=': function (stackArr) {
                if (stackArr.length < 2) {
                    throw new Error('!= operator require 2 args');
                }
                else {
                    const value = stackArr.pop();
                    const field = stackArr.pop();
                    const obj = {};
                    obj[field] = { $ne: entity.castQueryParam(field, value) };
                    stackArr.push(obj);
                }
            },
            '>': function (stackArr) {
                if (stackArr.length < 2) {
                    throw new Error('> operator require 2 args');
                }
                else {
                    const value = stackArr.pop();
                    const field = stackArr.pop();
                    const obj = {};
                    obj[field] = { $gt: entity.castQueryParam(field, value) };
                    stackArr.push(obj);
                }
            },
            '>=': function (stackArr) {
                if (stackArr.length < 2) {
                    throw new Error('>= operator require 2 args');
                }
                else {
                    const value = stackArr.pop();
                    const field = stackArr.pop();
                    const obj = {};
                    obj[field] = { $gte: entity.castQueryParam(field, value) };
                    stackArr.push(obj);
                }
            },
            '<': function (stackArr) {
                if (stackArr.length < 2) {
                    throw new Error('< operator require 2 args');
                }
                else {
                    const value = stackArr.pop();
                    const field = stackArr.pop();
                    const obj = {};
                    obj[field] = { $lt: entity.castQueryParam(field, value) };
                    stackArr.push(obj);
                }
            },
            '<=': function (stackArr) {
                if (stackArr.length < 2) {
                    throw new Error('<= operator require 2 args');
                }
                else {
                    const value = stackArr.pop();
                    const field = stackArr.pop();
                    const obj = {};
                    obj[field] = { $lte: entity.castQueryParam(field, value) };
                    stackArr.push(obj);
                }
            },
            '[': function (stackArr) {
                if (stackArr.length < 3) {
                    throw new Error('[ operator require 3 args');
                }
                else {
                    const nb = stackArr.pop();
                    let values = stackArr.splice(stackArr.length - nb);
                    const field = stackArr.pop();
                    const obj = {};
                    values = values.map((value) => {
                        return entity.castQueryParam(field, value);
                    });
                    obj[field] = { $in: values };
                    stackArr.push(obj);
                }
            },
            ']': function (stackArr) {
                if (stackArr.length < 3) {
                    throw new Error('] operator require 3 args');
                }
                else {
                    const nb = stackArr.pop();
                    let values = stackArr.splice(stackArr.length - nb);
                    const field = stackArr.pop();
                    const obj = {};
                    values = values.map((value) => {
                        return entity.castQueryParam(field, value);
                    });
                    obj[field] = { $nin: values };
                    stackArr.push(obj);
                }
            },
            '&': function (stackArr) {
                /*
                     he $or operator performs a logical OR operation on an array of two or more <expressions> and selects
                     the documents that satisfy at least one of the <expressions>.
                     MongoDB : { $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }
                     Request : /field/expression1/expression2/&/
                 */
                if (stackArr.length < 2) {
                    throw new Error('& operator require 2 args');
                }
                else {
                    const param2 = stackArr.pop();
                    const param1 = stackArr.pop();
                    if (param1.$and) {
                        const obj = {};
                        param1.$and.push(param2);
                        stackArr.push(param1);
                    }
                    else if (param2.$and) {
                        const obj = {};
                        param2.$and.push(param1);
                        stackArr.push(param2);
                    }
                    else {
                        const obj = {};
                        obj.$and = [param1, param2];
                        stackArr.push(obj);
                    }
                }
            },
            $or: function (stackArr) {
                if (stackArr.length < 2) {
                    throw new Error('$or operator require 2 args');
                }
                else {
                    const param2 = stackArr.pop();
                    const param1 = stackArr.pop();
                    if (param2.$or) {
                        const obj = {};
                        param2.$or.push(param1);
                        stackArr.push(param2);
                    }
                    else if (param1.$or) {
                        const obj = {};
                        param1.$or.push(param2);
                        stackArr.push(param1);
                    }
                    else {
                        const obj = {};
                        obj.$or = [param1, param2];
                        stackArr.push(obj);
                    }
                }
            },
            $not: function (stackArr) {
                /*
                      $not performs a logical NOT operation on the specified <operator-expression> and selects the documents
                      that do not match the <operator-expression>.
                      MongoDB : { field: { $not: { <operator-expression> } } }
                      Request : /expression/not/
                  */
                if (stackArr.length < 1) {
                    throw new Error('$not operator require 1 args');
                }
                else {
                    const expression = stackArr.pop();
                    const field = Object.keys(expression)[0];
                    const opExpression = expression[field];
                    const obj = {};
                    obj[field] = { $not: opExpression };
                    stackArr.push(obj);
                }
            },
            $nor: function (stackArr) {
                /*
                      Performs a logical NOR operation on an array of one or more query expression and selects the documents
                      that fail all the query expressions in the array.
                      MongoDB : { $nor: [ { <expression1> }, { <expression2> }, ...  { <expressionN> } ] }
                      Request : /exp1/exp2/../expN/nor/
                  */
                if (stackArr.length < 2) {
                    throw new Error('$nor operator require 2 args');
                }
                else {
                    const expressions = stackArr.splice(0, stackArr.length);
                    const obj = { $nor: expressions };
                    stackArr.push(obj);
                }
            },
            $exists: function (stackArr) {
                /*
                      When <boolean> is true, $exists matches the documents that contain the field, including documents where
                      the field value is null. If <boolean> is false, the query returns only the documents that do not contain the field.
                      MongoDB : {field : { $exists: exist<boolean> } }
                      Request : /field/boolean/exists/
                  */
                if (stackArr.length < 2) {
                    throw new Error('$exists operator require 2 args');
                }
                else {
                    const exists = stackArr.pop() === 'true';
                    const field = stackArr.pop();
                    const obj = {};
                    obj[field] = { $exists: exists };
                    stackArr.push(obj);
                }
            },
            $type: function (stackArr) {
                /*
                      Selects the documents where the value of the field is an instance of the specified BSON type.
                      MongoDB : {field : { $type: type<string | number>} }
                      Request : /field/<string | number>/type/
                  */
                if (stackArr.length < 2) {
                    throw new Error('$type operator require 2 args');
                }
                else {
                    let type = stackArr.pop();
                    const field = stackArr.pop();
                    if (!isNaN(type)) {
                        type = +type;
                    }
                    const obj = {};
                    obj[field] = { $type: type };
                    stackArr.push(obj);
                }
            },
            $mod: function (stackArr) {
                /*
                      Select documents where the value of a field divided by a divisor has the specified remainder (i.e. perform
                      a modulo operation to select documents).
                      MongoDB : { field: { $mod: [ divisor<number>, remainder<number>, ] } }
                      Request : /field/divisor/remainder/type/
                  */
                if (stackArr.length < 3) {
                    throw new Error('$mod operator require 3 args');
                }
                else {
                    const remainder = +stackArr.pop();
                    const divisor = +stackArr.pop();
                    const field = stackArr.pop();
                    const obj = {};
                    obj[field] = { $mod: [divisor, remainder] };
                    stackArr.push(obj);
                }
            },
            $regex: function (stackArr) {
                /*
                     Provides regular expression capabilities for pattern matching strings in queries.
                     MongoDB : { <field>: { $regex: /pattern/, $options: '<options>' } }
                     Request : /field/regexp/option/regex/
                 */
                if (stackArr.length < 3) {
                    throw new Error('$regex operator require 3 args');
                }
                else {
                    const options = stackArr.pop();
                    const regex = stackArr.pop();
                    const field = stackArr.pop();
                    const obj = {};
                    obj[field] = { $regex: regex, $options: options };
                    stackArr.push(obj);
                }
            },
            $regex2: function (stackArr) {
                /*
                     Provides regular expression capabilities for pattern matching strings in queries.
                     MongoDB : { <field>: { $regex: /pattern/, $options: '<options>' } }
                     Request : /field/regexp/option/regex/
                 */
                if (stackArr.length < 2) {
                    throw new Error('$regex2 operator require 2 args');
                }
                else {
                    // let options: string = stackArr.pop();
                    const regex = stackArr.pop();
                    const field = stackArr.pop();
                    const obj = {};
                    obj[field] = { $regex: regex };
                    stackArr.push(obj);
                }
            },
            $text: function (stackArr) {
                if (stackArr.length < 4) {
                    throw new Error('$text operator require a least 4  args');
                }
                else {
                    const diacriticSensitive = stackArr.pop() === 'true';
                    const caseSensitive = stackArr.pop() === 'true';
                    const language = stackArr.pop();
                    const search = stackArr.pop();
                    const obj = {};
                    obj.$text = {
                        $search: search,
                        $language: language,
                        $caseSensitive: caseSensitive,
                        $diacriticSensitive: diacriticSensitive,
                    };
                    stackArr.push(obj);
                }
            },
            $all: function (stackArr) {
                if (stackArr.length < 3) {
                    throw new Error('$all operator require 3 args');
                }
                else {
                    const nb = stackArr.pop();
                    const values = stackArr.splice(stackArr.length - nb);
                    const field = stackArr.pop();
                    const obj = {};
                    obj[field] = { $all: values };
                    stackArr.push(obj);
                }
            },
            $elemMatch: function (stackArr) {
                if (stackArr.length < 2) {
                    throw new Error('$elemMatch operator require 2 args');
                }
                else {
                    const queries = stackArr.pop();
                    const field = stackArr.pop();
                    const obj = {};
                    obj[field] = { $elemMatch: queries };
                    stackArr.push(obj);
                }
            },
            $size: function (stackArr) {
                /*
                      The $size operator matches any array with the number of elements specified by the argument.
                      MongoDB : { field: { $size: size<Number> } }
                      Request : /field/size/size/
                  */
                if (stackArr.length < 2) {
                    throw new Error('$size operator size require 2 args');
                }
                else {
                    const size = new Number(stackArr.pop());
                    const field = stackArr.pop();
                    const obj = {};
                    obj[field] = { $size: size.valueOf() };
                    stackArr.push(obj);
                }
            },
            $pop: function (stackArr) {
                if (stackArr.length < 1) {
                    throw new Error('$pop operator require 1 args');
                }
                else {
                    const param1 = stackArr.pop();
                    const obj = { name: '$pop' };
                    obj.value = param1;
                    stackArr.push(obj);
                }
            },
            $distinct: function (stackArr) {
                if (stackArr.length < 1) {
                    throw new Error('$distinct operator require 1 args');
                }
                else {
                    const param1 = stackArr.pop();
                    const obj = { name: '$distinct' };
                    obj.value = param1;
                    stackArr.push(obj);
                }
            },
            $limit: function (stackArr) {
                if (stackArr.length < 1) {
                    throw new Error('$limit operator require 1 args');
                }
                else {
                    const param1 = new Number(stackArr.pop()).valueOf();
                    const obj = { name: '$limit' };
                    obj.value = param1;
                    stackArr.push(obj);
                }
            },
            $skip: function (stackArr) {
                if (stackArr.length < 1) {
                    throw new Error('$skip operator require 1 args');
                }
                else {
                    const param1 = new Number(stackArr.pop()).valueOf();
                    const obj = { name: '$skip' };
                    obj.value = param1;
                    stackArr.push(obj);
                }
            },
            $sort: function (stackArr) {
                if (stackArr.length < 1) {
                    throw new Error('$sort operator require 2 args');
                }
                else {
                    const param1 = stackArr.pop();
                    const param2 = stackArr.pop();
                    const obj = { name: '$sort' };
                    const sort = {};
                    sort[param2] = new Number(param1).valueOf();
                    obj.value = sort;
                    stackArr.push(obj);
                }
            },
            $count: function (stackArr) {
                if (stackArr.length < 0) {
                    throw new Error('$count operator require 1 args');
                }
                else {
                    const obj = { name: '$count' };
                    stackArr.push(obj);
                }
            },
        };
        const stackArr = [];
        const queryArr = req
            .split('/')
            .filter(function (value, index, arr) {
            if (value && value != '') {
                return true;
            }
            else {
                return false;
            }
        });
        while (queryArr.length) {
            const word = decodeURIComponent(queryArr.shift());
            if (operators[word]) {
                operators[word](stackArr);
            }
            else {
                if (word.length === 24 &&
                    /^[a-h0-9]{24}$/i.test(word) &&
                    mongodb_1.ObjectId.isValid(word)) {
                    stackArr.push(new mongodb_1.ObjectId(word));
                }
                else {
                    stackArr.push(word);
                }
            }
        }
        return stackArr;
    });
}
exports.polonaisInverse = polonaisInverse;
