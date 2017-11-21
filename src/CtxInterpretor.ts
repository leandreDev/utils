import * as _ from 'lodash' ;
import * as assert from 'assert' ;

export class CtxInterpretor {

  private context:any ;

  constructor(context:any){
    assert(context, "context is not spécified");
    this.context = context ;
  }


  private setEnv(varKey) {
    if(varKey.indexOf(".") == -1){
      if (this.context.hasOwnProperty(varKey)) {
        return this.context[varKey];
      } else {
        return "$ENV." + varKey + "$$";
      }
    }else{
      let argVar:string[] = varKey.split(".") ;
      let targetContext = this.context ;
      argVar.forEach((val)=>{
        if (targetContext && targetContext.hasOwnProperty(varKey)) {
          targetContext = targetContext[val] ;
        }else{
          targetContext = null ;
        }
      })
      if(targetContext != null ){
        return targetContext ;
      }else{
        return "$ENV." + varKey + "$$" ;
      }
    }
    
  };

  private setGlobalEnv(stringKey) {
    var arr, result;
    arr = stringKey.split("$ENV.");
    result = "";
    _.each(arr, (val) => {
      let indexOf = val.indexOf("$$") ;
      if(indexOf == -1){
        result += this.setEnv(val);
      }else{
        let value = val.substr(0 ,indexOf) ;
        result += this.setEnv(value) + val.substr(indexOf) ;
      }
      // var data;
      // data = val.split("$$");
      // _.each(data, (value ) => {
      //    result += this.setEnv(value);
      // });
    });
    return result;
  };

  public updateEnv( obj:any):any{
     _.each(obj, (val, key) => {
      var arr;
      if (_.isString(val)) {
        return obj[key] = this.setGlobalEnv(val);
      } else if (_.isArray(val)) {
        arr = [];
        _.each(val, (obj) => {
          if (_.isString(obj)) {
            return arr.push(this.setGlobalEnv(obj));
          } else {
            this.updateEnv(obj);
            return arr.push(obj);
          }
        });
        return obj[key] = arr;
      } else if (_.isObject(val)) {
        return this.updateEnv(val);
      }
    });
    return obj ;
  }
}
