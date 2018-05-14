import { Component, AfterViewInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements  AfterViewInit {
networkForm: FormGroup



constructor (private  fb: FormBuilder){

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
       })/*,
       wirelessSettings: fb.group({

        */
       })

       this.onChanges();
       this.ethernetFormDisabler();
       this.dnsFormDisabler();



  }

  ngAfterViewInit() {

  }

  onChanges(): void {
  this.networkForm.get('ethernetSettings').get('obtainIPAuto').valueChanges.subscribe(val => {
    this.ethernetFormDisabler ();
  });

  this.networkForm.get('ethernetSettings').get('dnsAuto').valueChanges.subscribe(val => {
    this.dnsFormDisabler ();
  });
}


ethernetFormDisabler (){

  if(this.networkForm.get('ethernetSettings').get('obtainIPAuto').value === 'false') {
          this.networkForm.get('ethernetSettings').get('manualIpSettings').enable()

  } else {
          this.networkForm.get('ethernetSettings').get('manualIpSettings').disable()
  }
}

dnsFormDisabler (){

  if(this.networkForm.get('ethernetSettings').get('dnsAuto').value === 'false') {
        this.networkForm.get('ethernetSettings').get('manualDnsSettings').enable()

  } else {
        this.networkForm.get('ethernetSettings').get('manualDnsSettings').disable()
  }
}


}
