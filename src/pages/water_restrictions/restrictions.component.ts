import { Component } from '@angular/core';
import {
  NavController, NavParams, ToastController, AlertController,
  ViewController, ActionSheetController, LoadingController
} from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { Profile } from "../../interfaces/profile";
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-restrictions',
  templateUrl: 'restrictions.html'
})
export class Water_RestrictionsPage {
  private restrictionData$: Observable<any>;
  private restrictionData: any;
  private currentLevelData$: Observable<any>;
  private currentLevelData: any;
  private dataReady: boolean = false;
  private show_Specific_Level_Info:boolean = false;
  private show_Current_Level_Info:boolean = false;
  private level_to_Show:string;
  public tab: string = "general";
  public option: string;
  constructor(
    public viewCtrl: ViewController,
    public afDatabase: AngularFireDatabase,
    public alertCtrl: AlertController,
    public loading: LoadingController,
    public navParams: NavParams) {
    this.option = this.navParams.get("option");
    let temp = this;
    this.set_For_Option(this.option);
    this.restrictionData$ = this.afDatabase.object('/admin_panel/water_restrictions').valueChanges();
    this.restrictionData$.subscribe(data => {
      temp.restrictionData = data;
      console.log(temp.restrictionData);
      if (data) {
        temp.dataReady = true;
      }
    })
  }
  set_For_Option(option: string){
    let temp = this;
    if(option == undefined){
      return
    }
    else{
      switch(option){
        case "R_specific":
          this.currentLevelData$ = this.afDatabase.object('/admin_panel/water_restrictions/levels/current').valueChanges();
          this.currentLevelData$.subscribe(current_R_Level => {
            temp.currentLevelData = current_R_Level;
            temp.level_to_Show = current_R_Level.Level_Text;
            temp.show_Specific_Level_Info = false;
            temp.show_Current_Level_Info = true;
            temp.tab = 'levels';
          })
      }
    }
  }
  close() {
    this.viewCtrl.dismiss();
  }
  get_Level_Image_URL(level: string) {
    let url = "assets/img/R_level_";
    switch (level) {
      case "Level 1":
        url = url.concat("1.png");
        break;
      case "Level 2":
        url = url.concat("2.png");
        break;
      case "Level 3":
        url = url.concat("3.png");
        break;
      case "Level 4":
        url = url.concat("4.png");
        break;
      case "Level 5":
        url = url.concat("5.png");
        break;
    }
    return url;
  }
  show_Level_Info(level_title: string) {
    if (level_title === String(this.restrictionData.levels.current.Level_Text)){
      this.show_Specific_Level_Info = false;
      this.show_Current_Level_Info = true;
    }
    else{
      this.level_to_Show = level_title;
      this.show_Current_Level_Info = false;
      this.show_Specific_Level_Info = true;
    }
  }
  do_Not_Show_Level_info(){
    this.show_Current_Level_Info = false;
    this.show_Specific_Level_Info = false;
  }
  get_Level_Item_Color(level_title: string) {
    let item_color = "primary";
    if (level_title === String(this.restrictionData.levels.current.Level_Text)) {
      if (level_title === "Level 5") {
        item_color = "danger";
      } else {
        item_color = "dark";
      }
    }
    return item_color;
  }
  get_short_description(level_title: string){
    switch(level_title){
      case "Level 1":
        return this.restrictionData.levels.descriptions[0].short_description;
      case "Level 2":
        return this.restrictionData.levels.descriptions[1].short_description;
      case "Level 3":
        return this.restrictionData.levels.descriptions[2].short_description;
      case "Level 4":
        return this.restrictionData.levels.descriptions[3].short_description;
      case "Level 5":
        return this.restrictionData.levels.descriptions[4].short_description;
    }
  }
}
