import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';

import { ServerService } from './server.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements  OnInit {
networkForm: FormGroup
wifiList:any
message:any
color: string

constructor (private  fb: FormBuilder,
              private server: ServerService){

  this.networkForm = fb.group ({
    ethernetSettings: fb.group({
         obtainIPAuto: 'true',
         manualIpSettings:fb.group({
            ip:['', Validators.required],
            mask:['', Validators.required],
            gateway:''
          }),
        dnsAuto: 'true',
        manualDnsSettings: fb.group({
          preferedDns:['', Validators.required],
          alternativeDns:''

        })
       }),
       wirelessSettings: fb.group({
          enableWiFi: false,
          wifiOpt: fb.group({
            wifiName:['',Validators.required],
            wifiSecurity:'',
            wifiSecurityKey:['', Validators.required],
            wifiIpAuto:'true',
            wifiIpManual: fb.group({
              ipWiFi:['', Validators.required],
              subnetMaskWifi:['', Validators.required],
              defGateway:''
            }),
            wifiDNSServerAuto:'true',
            wifiDNSServerManual: fb.group({
              prefWifiDns:['', Validators.required],
              altWifiDns:''
            })
          })



          })
       })

       this.onChanges();
       this.ethernetFormDisabler();
       this.dnsFormDisabler();
       this.wifiForm()
       this.wifiIP()
       this.wifiDNS()

  }

  ngOnInit() {
    // get wifi list when load
   this.getWiFi()
    // set latest saved config
   this.server.getLastConfig().subscribe ((data)=>{

   console.log (data)
   this.networkForm.patchValue (data[0])
 })


  }

// listen for form changes
  onChanges(): void {
  this.networkForm.get('ethernetSettings').get('obtainIPAuto').valueChanges.subscribe(val => {
    this.ethernetFormDisabler ();
  });

  this.networkForm.get('ethernetSettings').get('dnsAuto').valueChanges.subscribe(val => {
    this.dnsFormDisabler ();
  });

  this.networkForm.get('wirelessSettings').get('enableWiFi').valueChanges.subscribe(val => {
    this.wifiForm ();
  });

  this.networkForm.get('wirelessSettings').get('wifiOpt').get('wifiDNSServerAuto').valueChanges.subscribe(val => {
    this.wifiDNS()
  });

  this.networkForm.get('wirelessSettings').get('wifiOpt').get('wifiIpAuto').valueChanges.subscribe(val => {
    this.wifiIP()
  });

  this.networkForm.get('wirelessSettings').get('wifiOpt').get('wifiSecurity').valueChanges.subscribe(val => {
    this.wifiSecurity()
  });


}

// get wifi list from ServerService
getWiFi(){

  this.server.getWiFiList().subscribe ((data)=>{
      this.wifiList= data
})

}


// form disable and enable
ethernetFormDisabler (){

  if(this.networkForm.get('ethernetSettings').get('obtainIPAuto').value === 'false') {
          this.networkForm.get('ethernetSettings').get('manualIpSettings').enable()

  } else {
          this.networkForm.get('ethernetSettings').get('manualIpSettings').reset()
          this.networkForm.get('ethernetSettings').get('manualIpSettings').disable()
  }
}

dnsFormDisabler (){

  if(this.networkForm.get('ethernetSettings').get('dnsAuto').value === 'false') {
        this.networkForm.get('ethernetSettings').get('manualDnsSettings').enable()

  } else {
        this.networkForm.get('ethernetSettings').get('manualDnsSettings').reset()
        this.networkForm.get('ethernetSettings').get('manualDnsSettings').disable()
  }
}


wifiForm(){

  if(this.networkForm.get('wirelessSettings').get('enableWiFi').value === true) {
        this.networkForm.get('wirelessSettings').get('wifiOpt').enable()

  } else {

        this.networkForm.get('wirelessSettings').get('wifiOpt').disable()
  }

  this.wifiIP()
  this.wifiDNS()
  this.wifiSecurity()
}

wifiIP(){
if (this.networkForm.get('wirelessSettings').get('enableWiFi').value === false) {
//this.networkForm.get('wirelessSettings').get('wifiOpt').get('wifiIpAuto').setValue('true',{onlySelf: true})
this.networkForm.get('wirelessSettings').get('wifiOpt').get('wifiIpManual').reset()


} else {

  if(this.networkForm.get('wirelessSettings').get('wifiOpt').get('wifiIpAuto').value === 'true') {

         this.networkForm.get('wirelessSettings').get('wifiOpt').get('wifiIpManual').disable()

   } else {
         this.networkForm.get('wirelessSettings').get('wifiOpt').get('wifiIpManual').enable()
   }

}

}

wifiDNS(){


  if (this.networkForm.get('wirelessSettings').get('enableWiFi').value === false){
    this.networkForm.get('wirelessSettings').get('wifiOpt').get('wifiDNSServerManual').reset()
  } else {
    if(this.networkForm.get('wirelessSettings').get('wifiOpt').get('wifiDNSServerAuto').value === 'true') {
          this.networkForm.get('wirelessSettings').get('wifiOpt').get('wifiDNSServerManual').disable()

    } else {
          this.networkForm.get('wirelessSettings').get('wifiOpt').get('wifiDNSServerManual').enable()
    }
  }


}

wifiSecurity(){

  if (this.networkForm.get('wirelessSettings').get('enableWiFi').value === false){
      this.networkForm.get('wirelessSettings').get('wifiOpt').get('wifiSecurityKey').reset()
  } else {
    if(this.networkForm.get('wirelessSettings').get('wifiOpt').get('wifiSecurity').value === true) {
          this.networkForm.get('wirelessSettings').get('wifiOpt').get('wifiSecurityKey').enable()

    } else {
          this.networkForm.get('wirelessSettings').get('wifiOpt').get('wifiSecurityKey').disable()
    }

  }
}
// end form disable and enable

// saving data to server

saveOptions (){

if (this.networkForm.valid === true) {
  let config = this.networkForm.value
  this.server.saveOpt(config).subscribe (()=> {
    this.message = 'Saved'
    this.color = 'alert alert-success'
  })

} else {

  this.message = 'Fields with * are mandatory. Deactevate or fulfill them'
  this.color = 'alert alert-danger'
}

}

resetForm(){
this.networkForm.reset()

}
}
