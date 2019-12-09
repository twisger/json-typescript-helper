export interface Human {
  eye: string;
  ear: string;
  mouth: boolean;
}

export interface Animal {
  foot: string;
  wing: boolean;
  claw: boolean;
}

// todo support nest
export interface Creature {
  human: Human,
}

export interface Girl extends Human {
  hair: string;
}

export interface Cat extends Animal {
  fur: string;
}

