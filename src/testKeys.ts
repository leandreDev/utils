import {UtilsSecu} from    "./UtilsSecu" ;

var utilSecu:UtilsSecu = new UtilsSecu({conf:{secretKey:"BOf5u8FgRaUCe8h3oESxOiksanNEDi6T0AuL9qRRIZs="}}) ;
var rq:any ={
    url:"https://core-services-dev.daesign.com/sso-dbs/collection/oidc_account/email/hfdevpro@gmail.com/="  ,
    headers:{}
}
utilSecu.addHeadersKey(rq) ;

console.log(rq) ;

rq.url = "https://core-services-dev.daesign.com//sso-dbs//collection//oidc_account/email/hfdevpro@gmail.com/="
utilSecu.addHeadersKey(rq) ;

console.log(rq) ;