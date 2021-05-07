/* eslint-disable @typescript-eslint/ban-types */
import { ObjectId } from 'mongodb';
export function polonaisInverse(
  req = '*',
  entity: { castQueryParam(path: string, value: any): any }
): Promise<any[]> {
  return Promise.resolve().then(() => {
    const operators = {
      $date: function (stackArr: any[]) {
        if (stackArr.length < 1) {
          throw new Error(' $date operator require 1 args');
        } else {
          const value: string = stackArr.pop();
          stackArr.push(new Date(value));
        }
      },
      $num: function (stackArr: any[]) {
        if (stackArr.length < 1) {
          throw new Error(' $num operator require 1 args');
        } else {
          const value: string = stackArr.pop();
          stackArr.push(new Number(value).valueOf());
        }
      },
      $bool: function (stackArr: any[]) {
        if (stackArr.length < 1) {
          throw new Error('$bool operator require 1 args');
        } else {
          const value = stackArr.pop();
          let castValue: boolean;
          if (value !== null && value !== undefined && value.toString) {
            if (
              value.toString().toLowerCase() === 'true' ||
              value.toString() === '1'
            ) {
              castValue = true;
            } else if (
              value.toString().toLowerCase() === 'false' ||
              value.toString() !== '1'
            ) {
              castValue = false;
            }
          } else {
            castValue = new Boolean(value).valueOf();
          }
          stackArr.push(castValue);
        }
      },
      $objectId: function (stackArr: any[]) {
        if (stackArr.length < 1) {
          throw new Error('$objectId operator require 1 args');
        } else {
          const value: string = stackArr.pop();
          try {
            stackArr.push(new ObjectId(value));
          } catch (err) {
            throw new Error('value ' + value + 'is not an ObjectId');
          }
        }
      },
      $null: function (stackArr: any[]) {
        stackArr.push(null);
      },
      '=': function (stackArr: any[]) {
        if (stackArr.length < 2) {
          throw new Error('= operator require 2 args');
        } else {
          const value: string = stackArr.pop();
          const field: string = stackArr.pop();
          const obj = {};
          obj[field] = { $eq: entity.castQueryParam(field, value) };
          stackArr.push(obj);
        }
      },
      '!=': function (stackArr: any[]) {
        if (stackArr.length < 2) {
          throw new Error('!= operator require 2 args');
        } else {
          const value: string = stackArr.pop();
          const field: string = stackArr.pop();
          const obj = {};
          obj[field] = { $ne: entity.castQueryParam(field, value) };
          stackArr.push(obj);
        }
      },
      '>': function (stackArr: any[]) {
        if (stackArr.length < 2) {
          throw new Error('> operator require 2 args');
        } else {
          const value: string = stackArr.pop();
          const field: string = stackArr.pop();
          const obj = {};
          obj[field] = { $gt: entity.castQueryParam(field, value) };
          stackArr.push(obj);
        }
      },
      '>=': function (stackArr: any[]) {
        if (stackArr.length < 2) {
          throw new Error('>= operator require 2 args');
        } else {
          const value: string = stackArr.pop();
          const field: string = stackArr.pop();
          const obj = {};
          obj[field] = { $gte: entity.castQueryParam(field, value) };
          stackArr.push(obj);
        }
      },
      '<': function (stackArr: any[]) {
        if (stackArr.length < 2) {
          throw new Error('< operator require 2 args');
        } else {
          const value: string = stackArr.pop();
          const field: string = stackArr.pop();
          const obj = {};
          obj[field] = { $lt: entity.castQueryParam(field, value) };
          stackArr.push(obj);
        }
      },
      '<=': function (stackArr: any[]) {
        if (stackArr.length < 2) {
          throw new Error('<= operator require 2 args');
        } else {
          const value: string = stackArr.pop();
          const field: string = stackArr.pop();
          const obj = {};
          obj[field] = { $lte: entity.castQueryParam(field, value) };
          stackArr.push(obj);
        }
      },
      '[': function (stackArr: any[]) {
        if (stackArr.length < 3) {
          throw new Error('[ operator require 3 args');
        } else {
          const nb: number = stackArr.pop();
          let values: any[] = stackArr.splice(stackArr.length - nb);
          const field: string = stackArr.pop();
          const obj = {};
          values = values.map((value) => {
            return entity.castQueryParam(field, value);
          });
          obj[field] = { $in: values };
          stackArr.push(obj);
        }
      },
      ']': function (stackArr: any[]) {
        if (stackArr.length < 3) {
          throw new Error('] operator require 3 args');
        } else {
          const nb: number = stackArr.pop();
          let values: any[] = stackArr.splice(stackArr.length - nb);
          const field: string = stackArr.pop();
          const obj = {};
          values = values.map((value) => {
            return entity.castQueryParam(field, value);
          });
          obj[field] = { $nin: values };
          stackArr.push(obj);
        }
      },
      '&': function (stackArr: any[]) {
        /*
             he $or operator performs a logical OR operation on an array of two or more <expressions> and selects
             the documents that satisfy at least one of the <expressions>.
             MongoDB : { $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }
             Request : /field/expression1/expression2/&/
         */
        if (stackArr.length < 2) {
          throw new Error('& operator require 2 args');
        } else {
          const param2: any = stackArr.pop();
          const param1: any = stackArr.pop();
          if (param1.$and) {
            const obj = {};
            param1.$and.push(param2);
            stackArr.push(param1);
          } else if (param2.$and) {
            const obj = {};
            param2.$and.push(param1);
            stackArr.push(param2);
          } else {
            const obj: any = {};
            obj.$and = [param1, param2];
            stackArr.push(obj);
          }
        }
      },
      $or: function (stackArr: any[]) {
        if (stackArr.length < 2) {
          throw new Error('$or operator require 2 args');
        } else {
          const param2: any = stackArr.pop();
          const param1: any = stackArr.pop();
          if (param2.$or) {
            const obj = {};
            param2.$or.push(param1);
            stackArr.push(param2);
          } else if (param1.$or) {
            const obj = {};
            param1.$or.push(param2);
            stackArr.push(param1);
          } else {
            const obj: any = {};
            obj.$or = [param1, param2];
            stackArr.push(obj);
          }
        }
      },
      $not: function (stackArr: any[]) {
        /*
              $not performs a logical NOT operation on the specified <operator-expression> and selects the documents
              that do not match the <operator-expression>.
              MongoDB : { field: { $not: { <operator-expression> } } }
              Request : /expression/not/
          */
        if (stackArr.length < 1) {
          throw new Error('$not operator require 1 args');
        } else {
          const expression: Object = stackArr.pop();
          const field = Object.keys(expression)[0];
          const opExpression = expression[field];
          const obj: any = {};
          obj[field] = { $not: opExpression };
          stackArr.push(obj);
        }
      },
      $nor: function (stackArr: any[]) {
        /*
              Performs a logical NOR operation on an array of one or more query expression and selects the documents
              that fail all the query expressions in the array.
              MongoDB : { $nor: [ { <expression1> }, { <expression2> }, ...  { <expressionN> } ] }
              Request : /exp1/exp2/../expN/nor/
          */
        if (stackArr.length < 2) {
          throw new Error('$nor operator require 2 args');
        } else {
          const expressions: any[] = stackArr.splice(0, stackArr.length);
          const obj: any = { $nor: expressions };
          stackArr.push(obj);
        }
      },
      $exists: function (stackArr: any[]) {
        /*
              When <boolean> is true, $exists matches the documents that contain the field, including documents where
              the field value is null. If <boolean> is false, the query returns only the documents that do not contain the field.
              MongoDB : {field : { $exists: exist<boolean> } }
              Request : /field/boolean/exists/
          */
        if (stackArr.length < 2) {
          throw new Error('$exists operator require 2 args');
        } else {
          const exists: boolean = stackArr.pop() === 'true';
          const field: string = stackArr.pop();
          const obj: any = {};
          obj[field] = { $exists: exists };
          stackArr.push(obj);
        }
      },
      $type: function (stackArr: any[]) {
        /*
              Selects the documents where the value of the field is an instance of the specified BSON type.
              MongoDB : {field : { $type: type<string | number>} }
              Request : /field/<string | number>/type/
          */
        if (stackArr.length < 2) {
          throw new Error('$type operator require 2 args');
        } else {
          let type: any = stackArr.pop();
          const field: string = stackArr.pop();
          if (!isNaN(type)) {
            type = +type;
          }
          const obj: any = {};
          obj[field] = { $type: type };
          stackArr.push(obj);
        }
      },
      $mod: function (stackArr: any[]) {
        /*
              Select documents where the value of a field divided by a divisor has the specified remainder (i.e. perform
              a modulo operation to select documents).
              MongoDB : { field: { $mod: [ divisor<number>, remainder<number>, ] } }
              Request : /field/divisor/remainder/type/
          */
        if (stackArr.length < 3) {
          throw new Error('$mod operator require 3 args');
        } else {
          const remainder: number = +stackArr.pop();
          const divisor: number = +stackArr.pop();
          const field: string = stackArr.pop();
          const obj: any = {};
          obj[field] = { $mod: [divisor, remainder] };
          stackArr.push(obj);
        }
      },
      $regex: function (stackArr: any[]) {
        /*
             Provides regular expression capabilities for pattern matching strings in queries.
             MongoDB : { <field>: { $regex: /pattern/, $options: '<options>' } }
             Request : /field/regexp/option/regex/
         */
        if (stackArr.length < 3) {
          throw new Error('$regex operator require 3 args');
        } else {
          const options: string = stackArr.pop();
          const regex: string = stackArr.pop();
          const field: string = stackArr.pop();
          const obj: any = {};
          obj[field] = { $regex: regex, $options: options };
          stackArr.push(obj);
        }
      },
      $regex2: function (stackArr: any[]) {
        /*
             Provides regular expression capabilities for pattern matching strings in queries.
             MongoDB : { <field>: { $regex: /pattern/, $options: '<options>' } }
             Request : /field/regexp/option/regex/
         */
        if (stackArr.length < 2) {
          throw new Error('$regex2 operator require 2 args');
        } else {
          // let options: string = stackArr.pop();
          const regex: string = stackArr.pop();
          const field: string = stackArr.pop();
          const obj: any = {};
          obj[field] = { $regex: regex };
          stackArr.push(obj);
        }
      },
      $text: function (stackArr: any[]) {
        if (stackArr.length < 4) {
          throw new Error('$text operator require a least 4  args');
        } else {
          const diacriticSensitive: boolean = stackArr.pop() === 'true';
          const caseSensitive: boolean = stackArr.pop() === 'true';
          const language: string = stackArr.pop();
          const search: string = stackArr.pop();
          const obj: any = {};
          if (language === 'all') {
            obj.$text = {
              $search: search,
              $caseSensitive: caseSensitive,
              $diacriticSensitive: diacriticSensitive,
            };
          } else {
            obj.$text = {
              $search: search,
              $language: language,
              $caseSensitive: caseSensitive,
              $diacriticSensitive: diacriticSensitive,
            };
          }

          stackArr.push(obj);
        }
      },
      $all: function (stackArr: any[]) {
        if (stackArr.length < 3) {
          throw new Error('$all operator require 3 args');
        } else {
          const nb: number = stackArr.pop();
          const values: any[] = stackArr.splice(stackArr.length - nb);
          const field: string = stackArr.pop();
          const obj: any = {};
          obj[field] = { $all: values };
          stackArr.push(obj);
        }
      },
      $elemMatch: function (stackArr: any[]) {
        if (stackArr.length < 2) {
          throw new Error('$elemMatch operator require 2 args');
        } else {
          const queries: any = stackArr.pop();
          const field: string = stackArr.pop();
          const obj: any = {};
          obj[field] = { $elemMatch: queries };
          stackArr.push(obj);
        }
      },
      $size: function (stackArr: any[]) {
        /*
              The $size operator matches any array with the number of elements specified by the argument.
              MongoDB : { field: { $size: size<Number> } }
              Request : /field/size/size/
          */
        if (stackArr.length < 2) {
          throw new Error('$size operator size require 2 args');
        } else {
          const size: Number = new Number(stackArr.pop());
          const field: string = stackArr.pop();
          const obj: any = {};
          obj[field] = { $size: size.valueOf() };
          stackArr.push(obj);
        }
      },
      $pop: function (stackArr: any[]) {
        if (stackArr.length < 1) {
          throw new Error('$pop operator require 1 args');
        } else {
          const param1: string = stackArr.pop();
          const obj: any = { name: '$pop' };
          obj.value = param1;
          stackArr.push(obj);
        }
      },
      $distinct: function (stackArr: any[]) {
        if (stackArr.length < 1) {
          throw new Error('$distinct operator require 1 args');
        } else {
          const param1: string = stackArr.pop();
          const obj: any = { name: '$distinct' };
          obj.value = param1;
          stackArr.push(obj);
        }
      },
      $limit: function (stackArr: any[]) {
        if (stackArr.length < 1) {
          throw new Error('$limit operator require 1 args');
        } else {
          const param1: number = new Number(stackArr.pop()).valueOf();
          const obj: any = { name: '$limit' };
          obj.value = param1;
          stackArr.push(obj);
        }
      },
      $skip: function (stackArr: any[]) {
        if (stackArr.length < 1) {
          throw new Error('$skip operator require 1 args');
        } else {
          const param1: number = new Number(stackArr.pop()).valueOf();
          const obj: any = { name: '$skip' };
          obj.value = param1;
          stackArr.push(obj);
        }
      },
      $sort: function (stackArr: any[]) {
        if (stackArr.length < 1) {
          throw new Error('$sort operator require 2 args');
        } else {
          const param1: string = stackArr.pop();
          const param2: string = stackArr.pop();
          const obj: any = { name: '$sort' };
          const sort = {};
          sort[param2] = new Number(param1).valueOf();
          obj.value = sort;
          stackArr.push(obj);
        }
      },
      $count: function (stackArr: any[]) {
        if (stackArr.length < 0) {
          throw new Error('$count operator require 1 args');
        } else {
          const obj: any = { name: '$count' };
          stackArr.push(obj);
        }
      },
    };
    const stackArr: any[] = [];
    req = `${req}`;
    const queryArr: string[] = req
      .split('/')
      .filter(function (value, index, arr) {
        if (value && value != '') {
          return true;
        } else {
          return false;
        }
      });
    while (queryArr.length) {
      const word = decodeURIComponent(queryArr.shift());
      if (operators[word]) {
        operators[word](stackArr);
      } else {
        if (
          word.length === 24 &&
          /^[a-h0-9]{24}$/i.test(word) &&
          ObjectId.isValid(word)
        ) {
          stackArr.push(new ObjectId(word));
        } else {
          stackArr.push(word);
        }
      }
    }

    return stackArr;
  });
}
