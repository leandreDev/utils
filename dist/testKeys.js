"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const UtilsSecu_1 = require("./UtilsSecu");
const request = require("request-promise-native");
// BOf5u8FgRaUCe8h3oESxOiksanNEDi6T0AuL9qRRIZs='
// jgffnFDGijg654FGHdeamlkdfj8egsglkhjBrfohg
// import * as crypto from  'crypto-js';
// var key:string = "rerererer" ;
// var date:number = Date.now() ;
// if(rq.headers.keyDate){
//     date = new Date(rq.headers.keyDate).valueOf() ;
// }else{
//     rq.headers.keyDate = date ;
// }
// console.info(rq.url) ;
// var url = encodeURI(rq.url.trim().toLowerCase().replace(/\/\/+/gi, '/').replace(/^([a-z]+):\/+/, "$1://"));
//     var key:string = crypto.HmacSHA256( date + url , key).toString()
// rq.headers.key = key
const utilSecu = new UtilsSecu_1.UtilsSecu({
    conf: { secretKey: "poipoi", debug: true },
});
// url:"http://localhost:3114/views/nbobservation/campaign/5d8490deea986b65521ad6dd/$objectId/=/creationDate/mon nov 18 2019 00:00:00 gmt+0100 (gmt+01:00)/$date/>/creationDate/mon nov 25 2019 00:00:00 gmt+0100 (gmt+01:00)/$date/</&/&/"  ,
// http://localhost:3114/views/nbobservation/campaign/5d8490deea986b65521ad6dd/$objectid/=/creationdate/mon%20nov%2018%202019%2000:00:00%20gmt+0100%20(gmt+01:00)/$date/%3e/creationdate/mon%20nov%2025%202019%2000:00:00%20gmt+0100%20(gmt+01:00)/$date/%3c/&/&/
const rq = {
    url: "http://localhost:3114/views/nbobservation/campaign/5d8490deea986b65521ad6dd/$objectId/=/creationDate/mon%20nov%2018%202019%2000:00:00%20gmt+0100%20(gmt+01:00)/$date/%3e/creationDate/mon%20nov%2025%202019%2000:00:00%20gmt+0100%20(gmt+01:00)/$date/%3c/&/&/",
    headers: {
        keyDate: Date.now(),
    },
};
utilSecu.addHeadersKey(rq);
// console.info(rq.headers.keyDate) ;
// console.info(rq.headers.key) ;
// utilSecu.testkey(rq );
request.get(rq).then((val) => {
    console.info(val);
});
