import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  
  signIn(data:any){
    return this.http.post<any>('https://1i4zp3969d.execute-api.us-west-2.amazonaws.com/Development/CommonAPI/Login', data);
  } 


  uneeqAvatar(){
    return this.http.get('https://m3p3q4rc26.execute-api.us-west-2.amazonaws.com/Development/New/CallAvatar')
  
  }


  sendAvatarMessage(data:any){
    return this.http.post('https://1i4zp3969d.execute-api.us-west-2.amazonaws.com/Development/uneeq/rulesForunsolicitedResponses',data)
  
  }
}
