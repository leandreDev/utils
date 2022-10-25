import { describe, expect, it } from '@jest/globals';
import { AssertionError } from 'assert';
import * as Moment from 'moment';

import { CtxInterpretor } from '../src/CtxInterpretor';
import { mocks } from './CtxInterpretor.mocks';

describe('CtxInterpretor', () => {
  describe('new CtxInterpretor', () => {
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

  describe('public properties', () => {
    const ctxInt = new CtxInterpretor({});

    it('should have a valid context', () => {
      expect(ctxInt.context).toBeDefined();
      expect(typeof ctxInt.context).toBe('object');
    });

    it('should have a valid startPatern', () => {
      expect(ctxInt.startPatern).toBeDefined();
      expect(typeof ctxInt.startPatern).toBe('string');
      expect(ctxInt.startPatern.length).toBeGreaterThan(0);
    });

    it('should have a valid endPatern', () => {
      expect(ctxInt.endPatern).toBeDefined();
      expect(typeof ctxInt.endPatern).toBe('string');
      expect(ctxInt.endPatern.length).toBeGreaterThan(0);
    });

    it('should have a valid splitPatern', () => {
      expect(ctxInt.splitPatern).toBeDefined();
      expect(typeof ctxInt.splitPatern).toBe('string');
      expect(ctxInt.splitPatern.length).toBeGreaterThan(0);
    });
  });

  describe('ctxInterpretor.updateEnv', () => {
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

    it('modify passed object and remove unknown variable: updateEnv(obj, false, true)', () => {
      let ctxInt = new CtxInterpretor(mocks.context);
      ctxInt.startPatern = mocks.startPattern;
      let obj = mocks.obj;
      let result = ctxInt.updateEnv(obj, false, true);

      expect(result.unknownVar).toBe('');
      expect(result === obj);
    });

    it('clone passed object and remove unknown variable: updateEnv(obj, false, true)', () => {
      let ctxInt = new CtxInterpretor(mocks.context);
      ctxInt.startPatern = mocks.startPattern;
      let obj = mocks.obj;
      let result = ctxInt.updateEnv(obj, false, true);

      expect(result.unknownVar).toBe('');
      expect(result !== obj);
    });
  });

  describe('moment function', () => {
    it('Add time', () => {
      let ctxInt = new CtxInterpretor(mocks.context);
      ctxInt.startPatern = mocks.startPattern;
      let obj = mocks.obj;
      let result = ctxInt.updateEnv(obj);

      let addTime = Moment(obj.moment[1]).add(obj.moment[2], obj.moment[3]).toDate();
      expect(result.add).toEqual(addTime);
    });

    it('Substract time', () => {
      let ctxInt = new CtxInterpretor(mocks.context);
      ctxInt.startPatern = mocks.startPattern;
      let obj = mocks.obj;
      let result = ctxInt.updateEnv(obj);

      let subTime = Moment(obj.moment[1]).subtract(obj.moment[2], obj.moment[3]).toDate();
      expect(result.sub).toEqual(subTime);
    });
  });
});
