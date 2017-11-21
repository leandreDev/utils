import {CtxInterpretor} from    "./CtxInterpretor" ;

var test:CtxInterpretor = new CtxInterpretor({body:{toto:"bla", titi:"lolo"}, opt:"erttyy"});

var poi:any = { 
		"aa":"$ENV.opt$$" , 
		"zz":"$ENV.body.toto$$uuuu" , 
		"qq":"qzsazqs$ENV.body.titi$$wxcvdfd",
		"aas":"$ENV.opt" ,
		"aax":"www$ENV.opt" ,
	}
test.updateEnv(poi);

console.log(poi) ;
