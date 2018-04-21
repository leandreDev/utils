import {CtxInterpretor} from    "./CtxInterpretor" ;

var test:CtxInterpretor = new CtxInterpretor({emailTarget:{toto:"bla", name:"dsdsds"}, opt:"erttyy" , num:32 , u:[{'t':"rere"}, "tutu"] });
test.startPatern = "$ctx."
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
		"ooo": "$ENV.num",
		"ooo2": "$ENV.num$$dsqdsq",
		"ooo3": "dsqdsq$ENV.num$$dsqdsq",
		"ooo4": "dsqdsq$ENV.num",
	}
var tester:any = {
	"from": {
		"email": "toto@toto.com"
	},
	"reply_to": {
		"email": "toto@toto.com"
	},
	"personalizations": [{
		"to": [{
			"email": "hfdevpro@gmail.com",
			"name": "henry favre"
		}],
		"substitutions": {
			"@@nomParcours": "toto",
			"@@mailClient": "$ctx.emailTarget.name",
			"@@prenom": "tutu",
			"@@prenomClient": "toto",
			"@@nomClient": "le hero",
			"@@lienPfDaesign": "http://lienPfDaesign",
			"@@dureeParcours": "30 min",
			"@@objectifPedagogique": "$ctx.u.0.t"
		}
	}],
	"template_id": "4cb2755a-ac05-4034-890a-f5c784dd1e98"
};

test.updateEnv(tester);

console.log(JSON.stringify(tester)) ;
