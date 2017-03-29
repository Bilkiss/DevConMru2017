import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';
import { TextToSpeech } from '@ionic-native/text-to-speech';

@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {

  public scanResults;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              private tts: TextToSpeech
  ) {
    this.tts = tts;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanPage');
  }

  scanCode(event){
    BarcodeScanner.scan()
      .then((scanResult) => {
        // Success! Barcode data is here
        this.scanResults = "We got a barcode" +
          "Result: " + scanResult.text + "n" +
          "Format: " + scanResult.format + "n" +
          "Cancelled: " + scanResult.cancelled;
        if (!scanResult) {
          let alert = this.alertCtrl.create({
            subTitle: 'QRCode unknown',
            buttons: ['OK']
          });
          alert.present();
        }
        else {
          if (!scanResult.cancelled) {
            var msgResult = JSON.parse(scanResult.text);
            var finalResult = msgResult.message;
            let alert = this.alertCtrl.create({
              subTitle: finalResult,
              buttons: ['OK']
            });
            alert.present();
            this.tts.speak(finalResult)
              .then(() => {
                let alertTTS = this.alertCtrl.create({
                  subTitle: 'Success',
                  buttons: ['OK']
                });
                alertTTS.present();
              })
              .catch((reason: any) => {
                let alertTTSError = this.alertCtrl.create({
                  subTitle: reason,
                  buttons: ['OK']
                });
                alertTTSError.present();
              });
          }
        }
      })
      .catch((err) => {
      let alert = this.alertCtrl.create({
        subTitle: err,
        buttons: ['OK']
      });
      alert.present();
    });
  }

}
