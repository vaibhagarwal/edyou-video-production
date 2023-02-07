import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  submitted: boolean= false;

  constructor(private auth:ApiService , private router :Router) { }

  ngOnInit(): void {
  }


     // form group
     form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      password: new FormControl('', Validators.required),
    })


  
    get email() {
      return this.form.controls['email'];
    }

    get password() {
      return this.form.controls['password'];
    }
  
  
    
    reset(){
      window.location.reload() 
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


  login(){
 
    this.submitted = true;
    if (this.form.valid) {
      let loginPayload = {
        "email": this.form.value.email,
        "password": this.form.value.password,
        "device": "web",
        "role":'AvatarRecorder'
      }
      this.isLoading = true
      this.auth.signIn(loginPayload).subscribe(
        (data:any) => {
          this.isLoading = false
          console.log(data)
          if (data.statusCode == 200) {
           
             // this.auth.storeUserData(data.Token, data.data);
             localStorage.setItem("User", JSON.stringify(data.data)); 
            // localStorage.setItem("Token", JSON.stringify(data.Token)); 
              this.router.navigate(['/dashboard'])
              // .then(() => {
              //   window.location.reload();
              // });

          } else{
          // this.statusCodeError(data)
          }
       
        })

      }else{
         this.validateAllFormFields(this.form);
        // $('#login').addClass('shake');
        // setTimeout(() => {
        //   $('#login').removeClass('shake');
        // }, 1000);
      }
  //  this.router.navigate(['/admin'])
  }

}
