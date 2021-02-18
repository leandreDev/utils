import * as mongo from 'mongodb';

export class Entity {
  static cast(obj: any, castChildClass = false) {
    if (obj._id) {
      obj._id = new mongo.ObjectId(obj._id);
    }
  }

  static check(target: any, isCompleteObj = true, path = ''): string[] {
    return [];
  }

  static castQueryParam(path: string, value: any): any {
    if (value === null) {
      return null;
    }
    switch (path) {
      case '_id':
        return new mongo.ObjectId(value);
        break;
      case '_class':
        return new String(value).valueOf();
        break;
      default:
        return value;
        break;
    }
  }

  public static getClassNameOfProp(path: string): string {
    return null;
  }
}
