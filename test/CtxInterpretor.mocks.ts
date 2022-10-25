let context: any = {
  emailTarget: { toto: 'bla', name: 'dsdsds' },
  opt: 'erttyy',
  num: 32,
  u: [{ t: 'rere' }, 'tutu'],
};

let startPattern = '$ctx.';

let obj: any = {
  from: {
    email: 'toto@toto.com',
    unknownVar: '$ctx.x.removeUnknownVar',
  },
  reply_to: {
    email: 'toto@toto.com',
  },
  personalizations: [
    {
      unknownVar: '$ctx.x.removeUnknownVar',
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
  unknownVar: '$ctx.x.removeUnknownVar',
};

let obj_raw = {
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

function deepClone(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

export let mocks = {
  get context() {
    return deepClone(context);
  },
  get obj() {
    return deepClone(obj);
  },
  startPattern,
  get obj_raw() {
    return deepClone(obj_raw);
  },
};
