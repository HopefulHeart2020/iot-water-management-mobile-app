import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

@Component({
  selector: 'tank-bar',
  templateUrl: 'tankbar.html'
})
export class TankbarComponent {
    @Input() tankType: string;
    @Input() tankLevel: number;
    @Input() tankVolume: string;
    waterColour: string = "#034aec";
    constructor(
      public alertCtrl: AlertController
    ){
      setTimeout( ms => {
        this.setColour()
      }, 50)
    }
    private setColour(){
      if(this.tankType == "Grey"){
        this.waterColour = "#D3D3D3";
      }
      else if (this.tankType == "Rain"){
        this.waterColour = "#ccccff";
      }else{
        this.waterColour = "#034aec";
      }
    }
    private showPercentage(){
      let alert = this.alertCtrl.create({
        title: this.tankType + "water Level",
        message: "Your reserves are " + this.tankLevel + "% full. You have " + this.tankVolume + " litres left.",
        buttons: [
          {
            text: "Okay",
            role: 'cancel'
          },
        ]
      }).present();
    }
}
