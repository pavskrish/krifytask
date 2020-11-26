import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

/*****Import Service to get all authentication Functions**********/
import { LoginService } from '../services/loginservice/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  /********Variables declaration starts********** */
  loginForm: FormGroup;
  submitted = false;
  errorMsg: boolean;
  errorMsgText: any = ''
  /**********Variables declarations ends***********/
  constructor(
    public router: Router,
    public loginService: LoginService
  ) {
    // function to set default admin Credentials...
    this.loginService.setAdminValues();

  }

  ngOnInit() {
    /******Method to create login form by using reactive forms***********/
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]), // set required
      password: new FormControl('', [Validators.required]) // set required
    });
  }

  /***** Function to return the Login form controls *******/
  get f() { return this.loginForm.controls; }

  /******Function to authenticate the admin details********/
  submit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    /*******Observable function to check admin authentication*******/
    this.loginService.checkAdminLogin(this.loginForm.value).subscribe((resp: any) => {
      if (resp.status == 'success') {
        this.loginService.setLoginVal(true); //Function to set loggedin status
        this.router.navigate(['/home']);
      }
      else {
        this.errorMsg = true;
        this.errorMsgText = resp.message;
      }
    }, (err) => {
      this.errorMsg = true;
      this.errorMsgText = err.message;
    })
  }


}
