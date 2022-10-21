/* eslint-disable no-prototype-builtins */
import * as _ from 'lodash';
import * as assert from 'assert';
import * as moment from 'moment';

export class CtxInterpretor {
  public context: any;
  public startPatern: string = '$ENV.';
  public endPatern: string = '$$';
  public splitPatern: string = '.';

  constructor(context: any) {
    assert(context, 'context is not specified');
    this.context = context;
  }

  private setEnv(varKey: string, removeUnknownVar: boolean = false): any {
    if (varKey.indexOf('.') == -1) {
      if (this.context.hasOwnProperty(varKey)) {
        return this.context[varKey];
      } else {
        return this.startPatern + varKey + this.endPatern;
      }
    } else {
      const argVar: string[] = varKey.split(this.splitPatern);
      let targetContext = this.context;

      argVar.forEach((val) => {
        if (targetContext) {
          if (_.isArray(targetContext) && !isNaN(parseInt(val))) {
            targetContext = targetContext[parseInt(val)];
          } else if (targetContext.hasOwnProperty(val)) {
            targetContext = targetContext[val];
          } else {
            targetContext = null;
          }
        }
      });

      if (targetContext != null) {
        return targetContext;
      } else {
        if (removeUnknownVar) {
          return '';
        } else {
          return this.startPatern + varKey + this.endPatern;
        }
      }
    }
  }

  private setGlobalEnv(stringKey: string, removeUnknownVar: boolean = false): string {
    let arr, result;

    if (stringKey.indexOf(this.startPatern) == -1) {
      return stringKey;
    } else {
      let envStart: number = stringKey.indexOf(this.startPatern);
      let envEnd: number;

      const startPaternLength: number = this.startPatern.length;
      const endPaternLength: number = this.endPatern.length;

      while (envStart > -1) {
        let preEnv = '';
        let postEnv = '';
        let envVar = '';

        if (envStart > 0) {
          preEnv = stringKey.substr(0, envStart);
        }

        envEnd = stringKey.indexOf(this.endPatern, envStart);

        if (envEnd == -1) {
          envEnd = stringKey.length;
        } else if (envEnd + endPaternLength < stringKey.length) {
          postEnv = stringKey.substr(envEnd + endPaternLength);
        }

        envVar = stringKey.substring(envStart + startPaternLength, envEnd);

        if (preEnv == '' && postEnv == '') {
          stringKey = this.setEnv(envVar, removeUnknownVar);
          envStart = -1;
        } else {
          stringKey = preEnv + this.setEnv(envVar, removeUnknownVar) + postEnv;

          envStart = stringKey.indexOf(this.startPatern, envStart + 1);
        }
      }

      return stringKey;
      // arr = stringKey.split("$ENV.");
      // result = "";
      // _.each(arr, (val) => {
      //   let indexOf = val.indexOf("$$") ;
      //   if(indexOf == -1){
      //     result += this.setEnv(val);
      //   }else{
      //     let value = val.substr(0 ,indexOf) ;
      //     result += this.setEnv(value) + val.substr(indexOf) ;
      //   }
      // });
      // return result;
    }
  }

  public updateArrEnv(obj: any[], clone: boolean = false, removeUnknownVar: boolean = false): any {
    const newArr: any[] = [];

    obj.forEach((data) => {
      if (_.isString(data)) {
        newArr.push(this.setGlobalEnv(data, removeUnknownVar));
      } else if (_.isArray(data)) {
        newArr.push(this.updateArrEnv(data, clone, removeUnknownVar));
      } else if (_.isObject(data)) {
        newArr.push(this.updateEnv(data, clone, removeUnknownVar));
      } else {
        newArr.push(data);
      }
    });

    if (newArr.length > 1 && <string>newArr[0].toString().slice(0, 3) == '$__') {
      // c'est une fonction
      const key: string = newArr[0].toString();

      try {
        switch (key) {
          /*
            Return value of those case are NOT any[] like newArr but Date !!!
          */
          case '$__moment_add':
            return moment(newArr[1]).add(parseFloat(newArr[2].toString()), newArr[3]).toDate();
          case '$__moment_substract':
            return moment(newArr[1]).subtract(parseFloat(newArr[2].toString()), newArr[3]).toDate();
          default:
            break;
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      return newArr;
    }
  }

  public updateEnv(obj: any, clone: boolean = false, removeUnknownVar: boolean = false): any {
    /*
      "obj" should be typed as an "Object" not as "any"
    */

    if (clone) {
      /*
        doenst deep clone
      */
      obj = Object.assign({}, obj);
    }

    _.each(obj, (val, key) => {
      let arr;
      if (_.isString(val)) {
        obj[key] = this.setGlobalEnv(val, removeUnknownVar);
      } else if (_.isArray(val)) {
        obj[key] = this.updateArrEnv(val, clone, removeUnknownVar);
      } else if (_.isObject(val)) {
        obj[key] = this.updateEnv(val, clone, removeUnknownVar);
      }
    });

    return obj;
  }
}
