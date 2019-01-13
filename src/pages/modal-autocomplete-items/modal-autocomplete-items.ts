import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';

declare var google: any;

@Component({
  selector: 'page-modal-autocomplete-items',
  templateUrl: 'modal-autocomplete-items.html'
})
export class ModalAutocompleteItems implements OnInit {
  geocoder: any;
  autocompleteItems: any;
  autocomplete: any;
  acService: any;
  placesService: any;
  private isReady: boolean = false;
  constructor(public viewCtrl: ViewController) {
    console.log("Initializing Geocoding Service");
    this.geocoder = new google.maps.Geocoder();
    console.log(this.geocoder)
  }

  ngOnInit() {
    console.log("Inside Google Maps Places things")
    console.log(google)
    this.acService = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
    this.isReady = true;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    let temp = this;
    if(item.place_id){
      this.geocoder.geocode({ 'placeId': item.place_id }, function(results, status) {
        if (status === 'OK') {
          temp.viewCtrl.dismiss(results[0]);
        } else {
          temp.viewCtrl.dismiss(null);
        }
      });
    }
  }

  updateSearch() {
    console.log('modal > updateSearch');
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let self = this;
    let config = {
      types: ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
      input: this.autocomplete.query,
      componentRestrictions: { country: 'ZA' }
    }
    console.log("test", this.acService.getPlacePredictions)
    this.acService.getPlacePredictions(config, function(predictions, status) {
      if (predictions == null || predictions == undefined) {
        return
      }
      console.log('modal > getPlacePredictions > status > ', status);
      self.autocompleteItems = [];
      predictions.forEach(function(prediction) {
        self.autocompleteItems.push(prediction);
      });
    });
  }
}
