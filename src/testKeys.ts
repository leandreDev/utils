import {UtilsSecu} from    "./UtilsSecu" ;
import * as url from 'url' ;

var utilSecu:UtilsSecu = new UtilsSecu({conf:{secretKey:"jgffnFDGijg654FGHdeamlkdfj8egsglkhjBrfohg"}}) ;
var rq:any ={
    url:"https://services-preprod.daesign.com/front-apps-dbs/collection/Task/startExecDate/$null/=/actionDate/2018-08-24T13:20:52.707Z/</&/1/$limit"  ,
    headers:{
        keyDate:1535116852707,
    }
}
utilSecu.addHeadersKey(rq) ;


console.log(rq) ;
