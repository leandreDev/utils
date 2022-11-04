import * as process from 'node:process';

import * as fs from 'fs-extra';
import * as assert from 'assert';
import * as request from 'request-promise-native';

import { CtxInterpretor } from './CtxInterpretor';
import { UtilsSecu } from './UtilsSecu';

export class ConfLoader {
  constructor() {}

  static getConf(): Promise<any> {
    return new Promise((resolve, reject) => {
      assert(process.env.CONF_URL, '$env.CONF_URL is not specified');
      assert(process.env.SRV_ID, '$env.SRV_ID is not specified');
      assert(process.env.SECRET, '$env.SECRET is not specified');

      /*
        options is never user
      */
      const options: request.options = {
        url: process.env.CONF_URL + process.env.SRV_ID,
        json: true,
      };

      /*
        secu is never used
      */
      const secu: UtilsSecu = new UtilsSecu({
        conf: { secretKey: process.env.SECRET, debug: false },
      });

      const contextInterpretor: CtxInterpretor = new CtxInterpretor(process.env);
      const filePath = './confs/' + process.env.SRV_ID + '.json';

      if (process.env.CONF_URL == 'none') {
        try {
          const val = fs.readJSONSync(filePath);
          const conf: any = contextInterpretor.updateEnv(val);

          resolve(val);
        } catch (err) {
          console.info('offline confloader error read JSON', err);
          reject(err);
        }
      } else {
        let tempConf: any;

        if (fs.existsSync(filePath)) {
          tempConf = fs.readJSONSync(filePath);

          if (tempConf.loadConfAfter) {
            ConfLoader.loadConf().catch((err) => {
              console.error(err);
            });
            resolve(tempConf);
          } else {
            // REALy Weird

            ConfLoader.loadConf().then(resolve).catch(reject);
          }
        } else {
          // REALy Weird
          ConfLoader.loadConf().then(resolve).catch(reject);
        }
      }
    });
  }

  static loadConf(): Promise<any> {
    const options: request.options = {
      url: process.env.CONF_URL + process.env.SRV_ID,
      json: true,
    };

    const secu: UtilsSecu = new UtilsSecu({
      conf: { secretKey: process.env.SECRET, debug: false },
    });

    const contextInterpretor: CtxInterpretor = new CtxInterpretor(process.env);

    secu.addHeadersKey(options);
    const filePath = './confs/' + process.env.SRV_ID + '.json';

    /*
      why do resolve a promise just return request
    */
    return Promise.resolve(
      request
        .get(options)
        .then((val) => {
          let data: any;

          if (val && val.code == 200 && val.response && val.response[0]) {
            data = val.response[0];

            fs.ensureDirSync('./confs');
            fs.writeJSONSync(filePath, data, {
              spaces: 2,
            });
          } else {
            if (val && val.code != 200) {
              console.error('online confloader error read JSON', val, options.url);
            }
            data = fs.readJSONSync(filePath);
          }

          /*
            conf is never used
          */
          const conf: any = contextInterpretor.updateEnv(data);

          return data;
        })
        .catch((err) => {
          try {
            console.error('confloader error on JSON ', err);

            const val = fs.readJSONSync(filePath);
            /*
              conf is never used
            */
            const conf: any = contextInterpretor.updateEnv(val);

            return val;
          } catch (err2) {
            console.error('confloader fatal error ', err2);
            throw err;
          }
        }),
    );
  }
}
