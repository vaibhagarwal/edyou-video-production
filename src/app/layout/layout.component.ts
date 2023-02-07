import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Uneeq } from 'uneeq-js';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare var $: any;


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  msgDisplay: any;
  uneeq: any;
  user: any;
  token: any;
  hideBar:boolean = false
  constructor(private service:ApiService) { }

  ngOnInit(): void {
   // this.funavatar()
  }

  form = new FormGroup({
    text: new FormControl('', Validators.required),

  })

  get text() {
    return this.form.controls['text'];
  }

    // activate  validation on submit
    validateAllFormFields(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach(field => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validateAllFormFields(control);
        }
      });
    }
  

    // uneeq avatar start function
    funavatar() {
      console.log('start')
      this.msgDisplay = document.getElementById('msg');
      const v1: any = document.getElementById('sm-video');
  
      let options = {
        url: 'https://api.us.uneeq.io',
        conversationId: '0e177d80-2545-49f8-9d53-9a1070ce9835',
        //production Id
       // conversationId: '8e4e7e90-a17d-441e-afdf-37b87394f04c',
        avatarVideoContainerElement: v1,
        localVideoContainerElement: v1,
        messageHandler: (msg: any) => this.messageHandler(msg),
        sendLocalVideo: false,
        enableMicrophone: true,
        micActivityMessages: true,
        playWelcome: true,
        //logging:true,
        enableTransparentBackground: true,
        voiceInputMode: "PUSH_TO_TALK",
        sendLocalAudio: true
      }
  
      this.uneeq = new Uneeq(options);
  
      this.service.uneeqAvatar().subscribe((res: any) => {
        this.uneeq.initWithToken(res.token);
      })
  
    }


     // uneeq avatar message handle function
  messageHandler(msg: any) {
    switch (msg.uneeqMessageType) {
      // SessionLive: Everything has loaded and the digital human is ready for interaction
      case 'SessionLive':
        console.log('------------------------------iiiiiiiiiiiiiiiiii---------------------------------')
        
        localStorage.setItem('sessionId', this.uneeq.sessionId)
        break;
      // The digital human has received a question (utterance) from the user
      case 'AvatarQuestionText':
        break;
      // The digital human has an answer to the question
      case 'AvatarAnswer':
        // this.avatarTextActive ==  msg.answerSpeech
        // aa.innerHTML = ''
        break;
      default:
        break;
    }
  }


  // uneeq end senssion
  endSession() {
    this.uneeq.endSession();
    document.body.classList.remove('live');
  }


  //stop hand button function
  stopSpeak() {
    this.uneeq.uneeqStopSpeaking()
  }





  submit(){
    $('#tt').addClass('full_screen')
    $('#avatarID').addClass('full_screen')
    this.hideBar = true 


    this.submitData()
  }


  submitData(){
    var session = localStorage.getItem('sessionId')
    let p ={
      "sessionId": session,
      "rules": this.form.value.text
    }
  console.log(p)
    this.service.sendAvatarMessage(p).subscribe((res:any)=>{

    })
  }


  closeCard(){
    $('#tt').removeClass('full_screen')
    $('#avatarID').removeClass('full_screen')
    this.hideBar = false
  }

}
