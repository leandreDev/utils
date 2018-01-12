import {CtxInterpretor} from    "./CtxInterpretor" ;

var test:CtxInterpretor = new CtxInterpretor({body:{toto:"bla", titi:"$ENV.opt$$"}, opt:"erttyy"});

var poi:any = { 
		"aa":"$ENV.opt$$" , 
		"zz":"$ENV.body.toto$$uuuu" , 
		"qq":"qzsazqs$ENV.body.titi$$wxcvdfd",
		"aas":"$ENV.opt" ,
		"aax":"www$ENV.opt" ,
		"aasss":"www$ENV.optsdsds$$dsds" ,
		"aasssq":"$ENV.optsdsds$$dsds" ,
		"aasssx":"www$ENV.optsdsds" ,
		"aasssw":"www$ENV.optsdsds$$dsdsdsd$ENV.opt" ,
	}
test.updateEnv(poi);

console.log(poi) ;
