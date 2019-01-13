import { Injectable } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { User } from "../interfaces/user";
import { Profile } from '../interfaces/profile';
import * as firebase from 'firebase/app';
import { Operator } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserRole_IF } from '../interfaces/interfaces_all';
import { IntroPage } from '../pages/intro/intro.component';
@Injectable()
export class GC_Authentication {
  private loggedIn: boolean;

  private subject = new Subject<any>();
  private toIntroData_BS: BehaviorSubject<toIntroData> = new BehaviorSubject({} as toIntroData);
  private userProfile: Profile;
  private user = {} as User;
  private auth;
  private uid;
  public userProfileObservable: Observable<any>;
  public userProfileRef$: Observable<Profile>
  constructor(
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
  )
  {

  }
  public canProceedToIntro( uid: string ){
    this.isLoggedIn(uid);
  }
  // PRIVATE FUNCTIONS //
  private isLoggedIn( uid: string  ){
    this.afAuth.authState.map( (result, error) =>{
      console.log("NEW AUTHENTICATION, AUTH STATE:", result)
      if ( result && result.email && result.uid){
        this.get_User_Role(result.uid)
      }
      else {
      console.log("Is Logged in Error in Auth State", error);

      }

    })
    .subscribe( result => {
      console.log("AND THE RESULT IS...", result);
    });
  }
  private get_User_Role( uid: string){
    let role$: Observable<UserRole_IF>;
    role$ = this.afDatabase.object("users_roles/" + uid).valueChanges();
    role$.take(1).subscribe(role => {
      console.log("IN AUTEHNTIVATION GETUSER AND ROLE", role)
      let args: toIntroData = {
        uid: uid,
        role: role,
      };
      this.toIntroData_BS.next(args);
    })
  }
  public getIntroData_BS(){
    return this.toIntroData_BS;
  }
  public set_Intro_Data_To_Null_On_Logout(){
    this.toIntroData_BS.next(null);
  }
  get_uid(){
    if(this.uid){
      return this.uid;
    }
    else{
      return false;
    }
  }
  async authenticate(){
    let temp = this;
    this.afAuth.authState.subscribe(
      data => {
        console.log("Auth Data")
        console.log(data)
        if (data && data.email && data.uid) {
          temp.uid = data.uid;
          this.userProfileRef$ = this.afDatabase.object('users/' + data.uid).valueChanges();
          this.userProfileRef$.subscribe( profile => {
            this.userProfile = profile;
            if(this.userProfile.role == undefined){
              console.log("The user has no specified role, must be a client");
            }
            else{
              // User has a role
              this.sendRole(this.userProfile.role);
            }
          });
          this.loggedIn = true;
        }
        else{
          this.loggedIn = false;
        }
      })
  }
  getRole(): Observable<any> {
    return this.subject.asObservable();
  }
  sendRole(role) {
    this.subject.next(role);
  }
  currentRole(){
    this.subject.next(this.userProfile.role);
  }
  check_Information_Before_Registering(user: User){
    return true;
  }
  sign_User_Out(){
    this.afAuth.auth.signOut();
    // this.nav.setRoot(LoginPage);
  }


}
interface toIntroData {
  uid: string;
  role: UserRole_IF;
}
