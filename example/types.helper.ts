import { pick } from 'lodash';

const map: { [index: string]: string[] } = {
  Human: ["eye", "ear", "mouth"], 
  Animal: ["foot", "wing", "claw"], 
  Creature: ["human"], 
  Girl: ["hair", "eye", "ear", "mouth"], 
  Cat: ["fur", "foot", "wing", "claw"]
};
export default (data: any, key: string) => {
  if (Array.isArray(data)) {
    return data.map((item) => pick(item, map[key]));
  } else {
    return pick(data, map[key]);
  }
};