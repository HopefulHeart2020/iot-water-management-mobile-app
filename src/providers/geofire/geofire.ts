import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as GeoFire from "geofire";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';



@Injectable()
export class GeofireProvider {

  dbRef: any;
  geoFire: any;

  hits = new BehaviorSubject([]);

  constructor(
    private db: AngularFireDatabase,
  ) {
    this.dbRef = this.db.list('/system_locations');
    this.geoFire = new GeoFire(this.dbRef.$ref);
  }
  set_Location(key: string, selected_Location: LocationInterface) {
    let coords: Array<number> = [];
    coords[0] = selected_Location.lat;
    coords[1] = selected_Location.lng;
    this.geoFire.set(key, coords)
      .then(_ => console.log('Location Updated'))
      .catch(err => console.log(err))
  }
  get_System_Location(gsid: string) {
    this.geoFire.get(gsid).then(function(location) {
      if (location === null) {
        console.log("Provided key is not in GeoFire");
      }
      else {
        console.log("System Location for GSID: " + gsid);
        console.log("Provided key has a location of " + location);
      }
    }, function(error) {
      console.log("Error: " + error);
    });
  }
  get_Locations(radius: number, coords: Array<number>) {
    this.geoFire.query({
      center: coords,
      radius: radius
    })
      .on('key_entered', (key, location, distance) => {
        let hit = {
          location: location,
          distance: distance
        }
        let currentHits = this.hits.value;
        currentHits.push(hit);
        this.hits.next(currentHits);

      })
  }
}
interface LocationInterface {
  lat: number;
  lng: number;
}
