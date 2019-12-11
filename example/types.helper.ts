import { pick } from 'lodash';

export const keyMap: { [index: string]: string[] } = {
  Human: ['eye', 'ear', 'mouth'],
  Animal: ['foot', 'wing', 'claw'],
  Creature: ['human'],
  Girl: ['hair', 'eye', 'ear', 'mouth'],
  Cat: ['fur', 'foot', 'wing', 'claw'],
  CuteCat: ['tail', 'fur'],
  ClockInterface: ['currentTime'],
  SuperMan: ['eye', 'ear', 'mouth'],
  Counter: ['interval'],
};
export default (data: any, key: string) => {
  if (Array.isArray(data)) {
    return data.map((item) => pick(item, keyMap[key]));
  } else {
    return pick(data, keyMap[key]);
  }
};
