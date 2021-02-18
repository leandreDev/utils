import { IBase } from './IBase';

export class Base implements IBase {
  public _id: string = ObjectId.stringObjectId();
  public _class: string;

  constructor(obj: any = {}) {
    if (obj._id) {
      this._id = obj._id;
    }
    if (obj._class) {
      this._class = obj._class;
    }
  }

  public check(target: any, isCompleteObj = true, path = ''): string[] {
    return Base.check(target, isCompleteObj, path);
  }
  public static check(target: any, isCompleteObj = true, path = ''): string[] {
    return null;
  }

  public static stringObjectId(): string {
    let _increment = Math.floor(Math.random() * 16777216);
    const _pid = Math.floor(Math.random() * 65536);
    const _machine = Math.floor(Math.random() * 16777216);
    const _timestamp = Math.floor(new Date().valueOf() / 1000);

    if (_increment > 0xffffff) {
      _increment = 0;
    }
    const timestamp = _timestamp.toString(16);
    const machine = _machine.toString(16);
    const pid = _pid.toString(16);
    const increment = _increment.toString(16);
    return (
      '00000000'.substr(0, 8 - timestamp.length) +
      timestamp +
      '000000'.substr(0, 6 - machine.length) +
      machine +
      '0000'.substr(0, 4 - pid.length) +
      pid +
      '000000'.substr(0, 6 - increment.length) +
      increment
    );
  }
}

export class ObjectId {
  static stringObjectId(): string {
    let _increment = Math.floor(Math.random() * 16777216);
    const _pid = Math.floor(Math.random() * 65536);
    const _machine = Math.floor(Math.random() * 16777216);
    const _timestamp = Math.floor(new Date().valueOf() / 1000);

    if (_increment > 0xffffff) {
      _increment = 0;
    }
    const timestamp = _timestamp.toString(16);
    const machine = _machine.toString(16);
    const pid = _pid.toString(16);
    const increment = _increment.toString(16);
    return (
      '00000000'.substr(0, 8 - timestamp.length) +
      timestamp +
      '000000'.substr(0, 6 - machine.length) +
      machine +
      '0000'.substr(0, 4 - pid.length) +
      pid +
      '000000'.substr(0, 6 - increment.length) +
      increment
    );
  }
}
