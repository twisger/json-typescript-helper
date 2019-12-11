export interface Human {
  eye: string;
  ear: string;
  mouth: boolean;
}

export interface Animal {
  foot: string;
  wing: boolean;
  claw?: boolean;
}

// todo support nest
export interface Creature {
  human: Human;
}

export interface Girl extends Human {
  hair: string;
}

export interface Cat extends Animal {
  fur: string;
}

// Function Types
interface SearchFunc {
  (source: string, subString: string): boolean;
}
// Indexable Types
interface NotOkay {
  [x: number]: string;
  [x: string]: string;
}
// Class Types
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date);
}
// Extending Interfaces
interface SuperMan extends Human {
  transform();
}
// Hybrid Types #
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}
// todo: support Interfaces Extending Classes
class Control {
  private state: any;
}
interface SelectableControl extends Control {
  select(): void;
}
// todo: support multiple extends
export interface CuteCat extends Cat {
  tail: string;
}