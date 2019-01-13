/*
  OBSERVABLE OBJECT INTERFACES
*/
/*
Generic System Observable
*/
export interface GenericSystemObservable_IF {
  state: string;
}
/*
Grey Heron Observables
*/
export interface GreyHeron_Obs_IF extends GenericSystemObservable_IF {
  HeronObservables: tankObservables;
}
/*
Rain Raptor Observables
*/
export interface RainRaptor_Obs_IF extends GenericSystemObservable_IF {
  RainRaptorObservables: tankObservables;
}
/*
Rain Falcon Observables
*/
export interface RainFalcon_Obs_IF extends RainRaptor_Obs_IF {
  MunicipalObservables?: any;
}
/*
Fish Eagle Observables
*/
export interface FishEagle_Obs_IF {
  RainFalconObservables: RainFalcon_Obs_IF;
  GreyHeronObservables: GreyHeron_Obs_IF;
}
/*
Bush Shrike Observables
*/
/*
ARBITRARY INTERFACES
*/
export interface tankObservables {
  volume: number;
  percentage: number;
}
