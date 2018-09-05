"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UtilsSecu_1 = require("./UtilsSecu");
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
// console.log(rq.url) ;
// var url = encodeURI(rq.url.trim().toLowerCase().replace(/\/\/+/gi, '/').replace(/^([a-z]+):\/+/, "$1://"));
//     var key:string = crypto.HmacSHA256( date + url , key).toString()
// rq.headers.key = key
var utilSecu = new UtilsSecu_1.UtilsSecu({ conf: { secretKey: "BOf5u8FgRaUCe8h3oESxOiksanNEDi6T0AuL9qRRIZs=" } });
var rq = {
    url: "https://core-services-dev.daesign.com/infra-dbs/collection/service/_id/5a7b091e2c7ffaa08624ec1b/5a7c630e85641fb35efc91b2/5a9d285f0781d42289545f5d/5a817025664c652a886065cc/5a7affee5727ddc99625773c/5ad704d2ce016f379f0c5dc4/5a7b22ee45ef23b95b0eabfa/5a81721382a0b6d8c4370358/5a69f34aead5593bf07759af/5ad703868af9dc98387c5d0b/5a7b22ee45ef23b95b0eabfa/5a81721382a0b6d8c4370358/5a69f34aead5593bf07759af/5ad703868af9dc98387c5d0b/14/[",
    headers: {
        keyDate: 1536133339494,
    }
};
utilSecu.addHeadersKey(rq);
//# sourceMappingURL=testKeys.js.map