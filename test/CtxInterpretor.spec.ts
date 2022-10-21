import { describe, expect, it } from '@jest/globals';
import { AssertionError } from 'assert';

import { CtxInterpretor } from '../src/CtxInterpretor';
import { mocks } from './CtxInterpretor.mocks';

describe('CtxInterpretor', () => {
  describe('new CtxInterpretor', () => {
    // new CtxInterpretor(context: any)

    it('constructor should throw error for null context', () => {
      expect(() => {
        new CtxInterpretor(null);
      }).toThrowError(AssertionError);
      expect(() => {
        new CtxInterpretor(undefined);
      }).toThrowError(AssertionError);
    });

    it('constructor should accept thruthfull value context', () => {
      expect(new CtxInterpretor({}));
      /*
        context should be alway a object BUT the interface let any truthly value to pass
      */
      expect(new CtxInterpretor(true));
      expect(new CtxInterpretor(' '));
      expect(new CtxInterpretor(1));
      expect(new CtxInterpretor([]));
    });

    it('set internal context value', () => {
      let ctx: any = {};
      let ctxInt = new CtxInterpretor(ctx);

      expect(ctxInt.context).toEqual(ctx);
    });
  });

  describe('ctxInterpretor.updateEnv', () => {
    /*
      return value should be obj
      obj ==  updateEnv(obj)

      these are equal:
      updateEnv(obj)
      updateEnv(obj, false)
      updateEnv(obj, false, false)
    */

    it('update passed object: updateEnv(obj)', () => {
      let ctxInt = new CtxInterpretor(mocks.context);
      ctxInt.startPatern = mocks.startPattern;
      let obj = mocks.obj;
      let result = ctxInt.updateEnv(obj);
      expect(result === obj);
    });

    it('update passed object: updateEnv(obj, false)', () => {
      let ctxInt = new CtxInterpretor(mocks.context);
      ctxInt.startPatern = mocks.startPattern;
      let obj = mocks.obj;
      let result = ctxInt.updateEnv(obj, false);

      expect(result === obj);
    });

    it('update passed object: updateEnv(obj, false, false)', () => {
      let ctxInt = new CtxInterpretor(mocks.context);
      ctxInt.startPatern = mocks.startPattern;
      let obj = mocks.obj;
      let result = ctxInt.updateEnv(obj, false, false);
      expect(result === obj);
    });

    it('all previous updateEnv(..) to have the same result', () => {
      let ctxInt = new CtxInterpretor(mocks.context);
      ctxInt.startPatern = mocks.startPattern;

      let obj1 = mocks.obj;
      let result1 = ctxInt.updateEnv(obj1);
      let obj2 = mocks.obj;
      let result2 = ctxInt.updateEnv(obj2, false);
      let obj3 = mocks.obj;
      let result3 = ctxInt.updateEnv(obj3, false, false);

      expect(result1).toStrictEqual(result2);
      expect(result2).toStrictEqual(result3);
    });

    /*
      return obj should be modified
      obj != updateEnv(obj, true)

      this is equal to
      updateEnv(obj, true, false)
    */

    it('clone passed object: updateEnv(obj, true)', () => {
      let ctxInt = new CtxInterpretor(mocks.context);
      ctxInt.startPatern = mocks.startPattern;
      let obj = mocks.obj;
      let result = ctxInt.updateEnv(obj, true);

      expect(result !== obj);
    });

    it('clone passed object: updateEnv(obj, true, false)', () => {
      let ctxInt = new CtxInterpretor(mocks.context);
      ctxInt.startPatern = mocks.startPattern;
      let obj = mocks.obj;
      let result = ctxInt.updateEnv(obj, true, false);
      expect(result !== obj);
      expect(result).not.toEqual(obj);
    });

    it('clone passed object: updateEnv(obj, true, false)', () => {
      let ctxInt = new CtxInterpretor(mocks.context);
      ctxInt.startPatern = mocks.startPattern;

      let obj1 = mocks.obj;
      let result1 = ctxInt.updateEnv(obj1, true);
      let obj2 = mocks.obj;
      let result2 = ctxInt.updateEnv(obj2, true, false);

      expect(result1).toEqual(result2);
    });
  });

  /*
  updateEnv(obj: any, clone: boolean = false, removeUnknownVar: boolean = false): any



    What is is doing here
      updateEnv(obj, false, true) =>  obj ==  updateEnv(obj, false, true)
      updateEnv(obj, true, true)

  */
});
