import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Uneeq } from 'uneeq-js';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  msgDisplay: any;
  uneeq: any;
  user: any;
  token: any;
  hideBar: boolean = false
  fullScreen: boolean = false;
  stopAvatarOnClick: boolean = false;
  constructor(private service: ApiService) { }

  ngOnInit(): void {
     this.funavatar()
    if (window.screen.width < 480) {
      $('#textfield').attr('rows', '4')

    } else {
      $('#textfield').attr('rows', '9')
    }


    window.addEventListener('resize', this.screenSize);
  }


  screenSize() {
    if (window.screen.width < 480) {
      $('#textfield').attr('rows', '4')

    } else {
      $('#textfield').attr('rows', '9')
    }
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
      $('#loader').css('display', 'none')
    })


  }


  // uneeq avatar message handle function
  messageHandler(msg: any) {
    switch (msg.uneeqMessageType) {
      // SessionLive: Everything has loaded and the digital human is ready for interaction
      case 'SessionLive':
        console.log('------------------------------iiiiiiiiiiiiiiiiii---------------------------------')

        var t: any = document.querySelector('#sm-video canvas')
        $(t).css('margin-top', '1px')
        localStorage.setItem('sessionId', this.uneeq.sessionId)
        break;
      // The digital human has received a question (utterance) from the user
      case 'AvatarQuestionText':
        break;
      // The digital human has an answer to the question
      case 'AvatarAnswer':
        console.log('vvv',msg.answerSpeech)
        // var data = msg.answerSpeech
   
        // var det = JSON.parse(data)
        //  if(det.hasOwnProperty('Question')){
        // var question = det.Question 
        // var option = det.options 
        // console.log('question',question)
        // console.log('option',option)
        //  }
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

  stopSpeaking() {
    this.stopAvatarOnClick =! this.stopAvatarOnClick
    this.uneeq.stopSpeaking()
  
  }


  preview(){
    this.submitData()
  }



  submit() {
    // if(this.form.valid){
    $('#tt').addClass('full_screen')
    $('#avatarID').addClass('full_screen')
    $('#tt').removeClass('yyy')
    $('#sm-video').addClass('uneeqAv')
    $('#stopIcon').addClass('showI')
    this.hideBar = true
    var t: any = document.querySelector('#sm-video canvas')
    $(t).css('margin-top', '0px')

    this.fullScreen = false
    this.changeAvatarSize()
    this.submitData()
    // }else{
    //  this.validateAllFormFields(this.form)
    //  }

  }


  submitData() {
    var session = localStorage.getItem('sessionId')
    let p = {
      "sessionId": session,
      "rules": this.form.value.text
    }
    console.log(p)
    this.service.sendAvatarMessage(p).subscribe((res: any) => {

    })
  }


  closeCard() {
    this.fullScreen = true
    $('#tt').removeClass('full_screen')
    $('#avatarID').removeClass('full_screen')
    $('#tt').addClass('yyy')
    $('#sm-video').removeClass('uneeqAv')
    $('#stopIcon').removeClass('showI')
    this.hideBar = false
    var t: any = document.querySelector('#sm-video canvas')
    $(t).css('margin-top', '1px')
    $(t).css('margin-left', '0px')
    this.changeAvatarSize()
    t
    //  this.uneeq.uneeqStopSpeaking()
  }



  changeAvatarSize() {
    if (this.fullScreen === false) {
      var t: any = document.querySelector('#sm-video canvas')
      // console.log('canvas',t)
      if (t !== null) {
        t.style.width = '95%',
        t.style.height = '700px',
          $(t).css('margin-left', '100px')
        // var tr = window.screen.width * window.devicePixelRatio
        // var yy = window.screen.height * window.devicePixelRatio
        // t.setAttribute("width", tr);
        // t.setAttribute("height",yy);
        // console.log(t,'after')
        if (window.screen.height == 1180 && window.screen.width == 820) {  // ipad air
          console.log('ggffddssaaa')
          t.style.height = '850px'
          $(t).css('margin-left', '20px')
        } else if (window.screen.height == 1024 && window.screen.width == 768) {
          t.style.height = '800px'
          $(t).css('margin-left', '20px')
        } else if (window.screen.height == 1366 && window.screen.width == 1024) {
          t.style.height = '760px'
          $(t).css('margin-left', '20px')
        } else if (window.screen.height == 1138 && window.screen.width == 712) {
          t.style.height = '600px'
          $(t).css('margin-left', '20px')
        } else if (window.screen.height == 720 && window.screen.width == 540) {
          t.style.height = '520px'
          $(t).css('margin-left', '20px')
        } else if (window.screen.height == 1368 && window.screen.width == 912) {
          t.style.height = '650px'
          $(t).css('margin-left', '20px')
        } else if (window.screen.height == 1280 && window.screen.width == 800) {
          t.style.height = '640px'
          $(t).css('margin-left', '20px')
        }
        else if (window.screen.height == 960 && window.screen.width == 600) { //
          t.style.height = '520px'
          $(t).css('margin-left', '20px')
        } else if (window.screen.height == 1076 && window.screen.width == 768) { //flod 1
          t.style.height = '770px'
          $(t).css('margin-left', '20px')
        }
        else if (window.screen.height == 1104 && window.screen.width == 884) { // flod 2,3
          t.style.height = '800px'
          $(t).css('margin-left', '20px')
        }
        else if (window.screen.width < 480) {
          t.style.height = '530px'
          t.style.width = '100%'
          $(t).css('margin-left', '0px')
          $('#sidebar').addClass(' sidebar_small')

        } else {
        //  t.style.height = '100%'
        }
      }




    } else {
      var t: any = document.querySelector('#sm-video canvas')
      // console.log('canvas',t)
      if (t !== null) {
        t.style.width = '100%'
        t.style.height = '100%'
      }
    }
  }

}
