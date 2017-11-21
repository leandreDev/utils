import {CtxInterpretor} from    "./CtxInterpretor" ;

var test:CtxInterpretor = new CtxInterpretor({body:{toto:"bla", titi:"lolo"}, opt:"erttyy"});

var poi:any = { 
		"aa":"$ENV.opt" , 
		"zz":"$ENV.body.toto" , 
		"qq":"$ENV.body.titi"
	}
test.updateEnv(poi);

console.log(poi) ;
