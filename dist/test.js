"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CtxInterpretor_1 = require("./CtxInterpretor");
const test = new CtxInterpretor_1.CtxInterpretor({
    emailTarget: { toto: 'bla', name: 'dsdsds' },
    opt: 'erttyy',
    num: 32,
    u: [{ t: 'rere' }, 'tutu'],
});
test.startPatern = '$ctx.';
const poi = {
    aa: '$ENV.opt$$',
    zz: 'qqq$ENV.body.toto$$/uuuu',
    qq: 'qzsazqs$/ENV.body.titi$$/wxcvdfd',
    aas: '$ENV.opt',
    aax: 'www$ENV.opt',
    aasss: 'www$ENV.optsdsds$$dsds',
    aasssq: '$ENV.optsdsds$$dsds',
    aasssx: 'www$ENV.optsdsds',
    aasssw: 'www$ENV.optsdsds$$dsdsdsd$ENV.opt',
    ooo: '$ENV.num',
    ooo2: '$ENV.num$$dsqdsq',
    ooo3: 'dsqdsq$ENV.num$$dsqdsq',
    ooo4: 'dsqdsq$ENV.num',
};
const tester = {
    from: {
        email: 'toto@toto.com',
    },
    reply_to: {
        email: 'toto@toto.com',
    },
    personalizations: [
        {
            to: [
                {
                    email: 'hfdevpro@gmail.com',
                    name: 'henry favre',
                },
            ],
            substitutions: {
                '@@nomParcours': 'toto',
                '@@mailClient': 'http://$ctx.emailTarget.name$$//',
                '@@prenom': 'http://$ctx.emailTarget.name$$/',
                '@@prenomClient': 'toto',
                '@@nomClient': 'le hero',
                '@@lienPfDaesign': 'http://lienPfDaesign',
                '@@dureeParcours': '30 min',
                '@@objectifPedagogique': '$ctx.u.0.t',
                '@@length': '$ctx.u.length',
            },
        },
    ],
    template_id: '4cb2755a-ac05-4034-890a-f5c784dd1e98',
};
// tester = {
// 	"rerer" : "http://$ctx.emailTarget.name$$/"
// }
setTimeout(() => {
    // eslint-disable-next-line no-debugger
    debugger;
    test.updateEnv(tester);
    console.info(JSON.stringify(tester));
}, 15000);
