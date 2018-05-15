import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Injectable()
export class ServerService {

  httpOptions = {
     headers: new HttpHeaders({
       'Content-Type':  'application/json'
     })
   }
  constructor(private http: HttpClient) { }



   getWiFiList(){
     return this.http.get ('api/wifilist')

   }

   saveOpt(config){
     console.log (config)

     return this.http.post ('api/saveconfig', {config}, this.httpOptions)

   }

   getLastConfig (){
    
     return this.http.get ('api/restoreform')
   }

}
