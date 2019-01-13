// import { Injectable } from '@angular/core';
// import { NavController, NavParams, AlertController } from 'ionic-angular';
// import { Observable } from 'rxjs/Observable';
// import { Subject } from 'rxjs/Subject';
// import { AngularFireAuth } from "angularfire2/auth";
// import { AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database";
// import { User } from "../interfaces/user";
// import { Profile } from '../interfaces/profile';
// import * as firebase from 'firebase/app';
//
// @Injectable()
// export class GC_Authentication {
//   private loggedIn: boolean;
//   private subject = new Subject<any>();
//   private userProfile: Profile;
//   private user = {} as User;
//   private auth;
//   private uid;
//   public userProfileObservable: Observable<any>;
//   public userProfileRef$: FirebaseObjectObservable<Profile>
//   constructor(
//     private afAuth: AngularFireAuth,
//     private afDatabase: AngularFireDatabase,
//   )
//   {
//     this.userProfileObservable = new Observable(observer => {
//       observer.next("Not logged in");
//     })
//       console.log("Inside GC Auth");
//   }
//   get_uid(){
//     if(this.uid){
//       return this.uid;
//     }
//     else{
//       return false;
//     }
//   }
//   async authenticate(){
//     let temp = this;
//     this.afAuth.authState.subscribe(
//       data => {
//         console.log("Auth Data")
//         console.log(data)
//         if (data && data.email && data.uid) {
//           temp.uid = data.uid;
//           this.userProfileRef$ = this.afDatabase.object('users/' + data.uid);
//           this.userProfileRef$.subscribe( profile => {
//             this.userProfile = profile;
//             if(this.userProfile.role == undefined){
//               console.log("The user has no specified role, must be a client");
//             }
//             else{
//               // User has a role
//               this.sendRole(this.userProfile.role);
//             }
//           });
//           this.loggedIn = true;
//         }
//         else{
//           this.loggedIn = false;
//         }
//       })
//   }
//   getRole(): Observable<any> {
//     return this.subject.asObservable();
//   }
//   sendRole(role) {
//     this.subject.next(role);
//   }
//   currentRole(){
//     this.subject.next(this.userProfile.role);
//   }
//   check_Information_Before_Registering(user: User){
//     return true;
//   }
//   sign_User_Out(){
//     this.afAuth.auth.signOut();
//     // this.nav.setRoot(LoginPage);
//   }
//
//
// }
