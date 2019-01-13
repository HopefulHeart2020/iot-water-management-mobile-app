import { Injectable } from '@angular/core';
import { Paho } from 'ng2-mqtt/mqttws31';
import { ToastController, AlertController } from 'ionic-angular';
import { Operator } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { System_IF } from '../../interfaces/interfaces_all';

@Injectable()
export class GC_MQTT_Service {
  // MQTT Client Connection Options
  private options = {
    userName: 'rdjghvoh',
    password: 'w7Ex0VTqZViw',
    timeout: 600,
    useSSL: true,
    onSuccess: this.onConnected.bind(this),
  };
  private mqttClientID:string  = 'mqttApp_' + Math.random().toString(16).substr(2, 8);
  private thisClient: Paho.MQTT.Client;
  private broker_connected_BS = new BehaviorSubject(false);
  private subscribedSystems_BS = new BehaviorSubject(Array<gcSystemSubscription>());
  private GC_System_Subscriptions: Array<gcSystemSubscription> = [];
  private tempPingThing: gcSystemSubscription = {} as gcSystemSubscription;
  public connected: boolean = false;
  public constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.initialize();
    this.connect();
  }
  // End of Constructor

  /*
    Functions
  */
  // PRIVATE FUNCTIONS
  private initialize(){
    console.log("MQTT Revamped Service, initializing...")
    this.subscribedSystems_BS.next([]);
    this.thisClient = new Paho.MQTT.Client(
      "m20.cloudmqtt.com",
      Number(30775),
      "",
      this.mqttClientID
    );
    this.thisClient.onConnectionLost = (responseObject: { errorCode: Number, errorMessage: string }) => {
      this.connected = false;
      this.broker_connected_BS.next(false);
      this.attemptReconnect();
      console.log("MQTT Connection Lost. Error Code: ", responseObject.errorCode);
      console.log("Error Message: ", responseObject.errorMessage);

    };

    this.thisClient.onMessageArrived = (message: Paho.MQTT.Message) => {
      this.handleIncomingMessage(message);
    };
  }
  private attemptReconnect(){
    let reconnectPrompt = this.alertCtrl.create({
      title: 'Connection to Systems Lost',
      message: "MQTT, the protocol used to communicate with your systems, has dropped out. Attempt to reconnect?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: data => {
            this.connect();
          }
        }
      ]
    });
    reconnectPrompt.present();
  }
  // UI Functions
  private presentToast(content: string){
    this.toastCtrl.create({
      position: 'middle',
      message: content,
      duration: 3000
    }).present();
  }
  private connect() {
    console.log("Attempting to connect to broker...")
    if (this.connected) {
      console.log("Already connected to broker")
      return
    }
    // Reset options object
    this.options = {
      userName: 'rdjghvoh',
      password: 'w7Ex0VTqZViw',
      timeout: 600,
      useSSL: true,
      onSuccess: this.onConnected.bind(this),
    };
    this.thisClient.connect(this.options);
  }
  private disconnect() {
    this.thisClient.disconnect();
  }

  private onConnected(): void {
    console.log('Connected to broker.');
    this.presentToast("Connected to MQTT Broker")
    this.connected = true;
    this.broker_connected_BS.next(true);
    let message: Paho.MQTT.Message = new Paho.MQTT.Message("Client: " + this.mqttClientID + " is connected to the broker."); // -1 => Notify
    message.destinationName = "AppConnection"
    this.thisClient.send(message);
  }
  private handleIncomingMessage(message: Paho.MQTT.Message) {
    let payload = message.payloadString;
    console.log("New Message Payload", payload);
    this.filterMessage(message);
  }
  private subscribeToTopic(topic: string, subscribeOptions: subscribeOptions) {
    if (!this.connected) {
      console.log("Cannot subscribe to topic, not connected to broker")
      return
    }
    this.thisClient.subscribe(topic, subscribeOptions);
  }
  private subscribeToTopics(topics: string[]) {
    for (var topic in topics) {
      this.thisClient.subscribe(topics[topic], {})
    }
  }
  private filterMessage(message: Paho.MQTT.Message) {
    console.log("Here we need to filter incoming mqtt message", message)
    if(this.tempPingThing.system){
      if(this.tempPingThing.awaitingPing){
        console.log("We are waiting for a ping..is this it?", message)
        if(this.tempPingThing.topic == message.destinationName){
          console.log("It is! It is a ping response!");
          this.tempPingThing.awaitingPing = false;
          let content = "Your "+ this.tempPingThing.system.system_model + " system, is online!"
          this.presentToast(content)
        }
      }
    }
  }
  // PUBLIC FUNCTIONS
  public get_Connected_BS(){
    return this.broker_connected_BS;
  }
  public sendMessage(_message: string, topic: string, ping?: any) : boolean {
    if (!this.connected) {
      console.log("Client not connected to MQTT Broker, cannot send message")
      return false;
    }
    var message = new Paho.MQTT.Message(_message);
    message.destinationName = topic;
    this.thisClient.send(message);
    console.log('Message ' + message + ' sent on topic ' + topic);
    return true;
  }
  public subscribe_To_Systems( systems: Array<System_IF> ){
    console.log("Subscribing to systems:", systems)
    for(let system of systems){
      console.log("Subscribing to GSID", system.GSID);
      let opts: subscribeOptions = {} as subscribeOptions;
      opts.invocationContext = {
        invocationContext: {
          system: system
        }
      };
      opts.onSuccess = (responseObject: gcInvokeContext) => {
        let responseData = responseObject.invocationContext as gcSystemSubscription;
        console.log("Success Function, response object:", responseObject)
        console.log("Response Data", responseData);
        this.GC_System_Subscriptions.push(responseData);
        this.subscribedSystems_BS.next(this.GC_System_Subscriptions);
        return true
      };
      opts.onFailure = (responseObject: gcInvokeContext) => {
        console.log("Failure Function, response object:", responseObject)
        return false
      };
      let topic = "TEST" + system.GSID;
      this.subscribeToTopic(topic, opts);
    }
  }
  public get_Broker_Online_BS(){
    return this.broker_connected_BS;
  }
  public get_System_Subscriptions_BS(): BehaviorSubject<Array<gcSystemSubscription>> {
    return this.subscribedSystems_BS;
  }
  public pingSystem(system: System_IF){
    console.log("Attempting to ping system", system)
    let topic =  system.GSID + '/I';
    let tempPingThng: gcSystemSubscription = {} as gcSystemSubscription;
    tempPingThng.system = system;
    tempPingThng.topic = topic;
    this.tempPingThing = tempPingThng;
    let opts: pingSubscribeOpts = {} as pingSubscribeOpts;
    opts.invocationContext = {
      invocationContext: tempPingThng
    };
    opts.onSuccess = (responseObject: gcInvokeContext) => {
      let responseData = responseObject.invocationContext as gcSystemSubscription;
      console.log("Subscribed Successfully to Ping", responseObject)
      console.log("Now need to send ping", responseData);
      let sendTopic = system.GSID + "/C";
      let success = this.sendMessage('?',sendTopic);
      if(success){
        this.tempPingThing.awaitingPing = true;
      }
      return true
    };
    opts.onFailure = (responseObject: gcInvokeContext) => {
      console.log("Failure Function, response object:", responseObject)
      return false
    };
    this.subscribeToTopic(topic, opts);
  }
}
interface subscribeOptions {
  qos?: number;
  invocationContext: gcInvokeContext;
  onSuccess: (responseObject: gcInvokeContext) => boolean;
  onFailure: (responseObject: gcInvokeContext) => boolean;
}
interface gcInvokeContext {
  invocationContext: gcSystemSubscription;
}

interface gcSystemSubscription {
  system: System_IF;
  awaitingPing?: boolean;
  topic?: string;
}
interface pingSubscribeOpts {
  qos?: number;
  invocationContext: any;
  onSuccess: (responseObject: gcInvokeContext) => boolean;
  onFailure: (responseObject: gcInvokeContext) => boolean;
}
