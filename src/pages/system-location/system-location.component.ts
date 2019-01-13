import { Component, ViewChild, ElementRef } from '@angular/core';
import {
  NavController, NavParams,
  LoadingController, AlertController,
  ModalController
} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { SystemInterface } from '../../interfaces/system';
import { GeofireProvider } from '../../providers/geofire/geofire';
import { ModalAutocompleteItems } from '../../pages/modal-autocomplete-items/modal-autocomplete-items';
declare var google;

@Component({
  selector: 'page-system-location',
  templateUrl: 'system-location.html',
})
export class SystemLocationPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  public location_marker: any;
  private selected_Location: locationInterface = {} as locationInterface;
  private mapReady: boolean = false;
  private location_SET: boolean = false;
  private existingLocation: boolean = false;
  private locationAddress: string;
  private queryType: string = 'geolocate';
  private loading: any;
  private system: SystemInterface = {} as SystemInterface;
  constructor(
    private geoFire: GeofireProvider,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public geolocation: Geolocation,
    public alertCtrl: AlertController,
  ) {
    let temp = this;
    this.system = this.navParams.get('system');
    this.geoFire.geoFire.get(String(this.system.GSID)).then(function(location) {
      if (location === null) {
        console.log("Provided GSID is not in GeoFire");
        temp.loadSearchMap();
      }
      else {
        console.log("Location", location)
        console.log("System Location for GSID: " + temp.system.GSID);
        console.log("Provided key has a location of " + location);
        temp.location_SET = true;
        temp.existingLocation = true;
        temp.selected_Location.lat = location[0];
        temp.selected_Location.lng = location[1];
        temp.loadMap();
      }
    }, function(error) {
      console.log("Error: " + error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SystemLocationPage');
    this.show_Loading();
    // if(this.location_SET){
    //   this.loadMap();
    // }else{
    //   this.loadSearchMap();
    // }
  }
  showModal() {
    // reset
    //this.reset();
    // show modal|
    let modal = this.modalCtrl.create(ModalAutocompleteItems);
    modal.onDidDismiss(data => {
      if (data != null && data.geometry.location != undefined) {
        console.log("Geolocated Data", data)
        this.add_Geolocated_Location_Marker(data.geometry.location);
      } else {
        this.alertCtrl.create({
          title: "Unable to Geolocate",
          subTitle: "Please try again."
        }).present();
      }
    })
    modal.present();
  }
  queryTypeIs(type: string) {
    let temp = this;
    if(type == 'geolocate'){
      temp.show_Loading();
      this.geolocation.getCurrentPosition().then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        temp.map.setCenter(latLng);
        temp.dismiss_Loading();
      });
    }
    this.queryType = type;
  }
  show_Loading() {
    this.loading = this.loadingCtrl.create({
      content: 'Waiting for map..'
    });
    this.loading.present();
  }
  dismiss_Loading() {
    this.loading.dismiss();
  }
  loadMap() {
    console.log("Existing location map loaded!")
    let temp = this;
    let latLng = new google.maps.LatLng(this.selected_Location.lat, this.selected_Location.lng);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(temp.mapElement.nativeElement, mapOptions);
    temp.mapReady = true;
    temp.add_Existing_Location_Marker();
    temp.dismiss_Loading();
  }
  loadSearchMap() {
    console.log("New location map loaded!")
    let temp = this;
    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(temp.mapElement.nativeElement, mapOptions)
      temp.mapReady = true;
      temp.dismiss_Loading();

    }, (err) => {
      console.log(err);
    });

  }
  add_CurrentPositionSystemMarker() {
    this.clear_Marker();
    let current_Position = this.map.getCenter();
    this.location_marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: current_Position,
      icon: 'assets/maps/gc_marker1.png'
    });
    let content = "<h4>System Location</h4><br><p>In this vast behemoth of space and time, you are here! Please ensure your system is too.</p>";
    this.addInfoWindow(this.location_marker, content);
    this.selected_Location.lat = current_Position.lat();
    this.selected_Location.lng = current_Position.lng();

    console.log("Selected Location:", this.selected_Location)
  }
  clear_Marker() {
    if(this.location_marker == null){
      return;
    }
    this.location_marker.setMap(null);
    this.location_marker = null;
  }
  add_Existing_Location_Marker() {
    this.clear_Marker();
    let current_Position = this.selected_Location;
    this.location_marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: current_Position,
      icon: 'assets/maps/gc_marker1.png'
    });
    let content = "<h4>System Location</h4><br><p>In this vast behemoth of space and time, you are here! Please ensure your system is too.</p>";
    this.addInfoWindow(this.location_marker, content);
    this.selected_Location.lat = current_Position.lat;
    this.selected_Location.lng = current_Position.lng;

    console.log("Existing Location:", this.selected_Location)
  }
  add_Geolocated_Location_Marker(location) {
    this.clear_Marker();
    console.log("Geolocated Coords", location)
    this.map.setCenter(location);
    this.location_marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: location,
      icon: 'assets/maps/gc_marker1.png'
    });
    let content = "<h4>System Location</h4><p>In this vast behemoth of space and time, you are here! Please ensure your system is too.</p>";
    this.addInfoWindow(this.location_marker, content);
    this.selected_Location.lat = location.lat();
    this.selected_Location.lng = location.lng();
    console.log("Existing Location:", this.selected_Location)
  }
  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content,

    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
  save_Location() {
    this.geoFire.set_Location(String(this.system.GSID), this.selected_Location);
  }
  addressSearch() {
    this.alertCtrl.create({
      title: "Coming Soon",
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }]
    }).present();
  }
  change_Location() {
    this.location_SET = false;
  }
  back_Existing() {
    this.location_SET = true;
  }
}
interface locationInterface {
  lat: number;
  lng: number;
}
