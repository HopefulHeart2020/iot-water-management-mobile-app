export interface IrrigationSettings {
  mode: string;
  Economic: boolean;
  Standard: boolean;
  Manic: boolean;
  economic_Minutes: number;
  standard_Minutes: number;
  manic_Minutes: number;
  zones?: [number];
  zone_Modes?: [Object];
  zones_Excluded?: [number];
  zone_Names?:[string];
}
