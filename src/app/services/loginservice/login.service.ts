import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    public localstorage: LocalStorage
  ) {
  }

  /*********To set the admin detials in the local storage************/
  setAdminValues() {
    var userdata = { username: "admin", password: 'admin' }
    this.localstorage.setItem('adminData', userdata).subscribe(() => { });
    this.setLoginVal(false)
  }

  /******Function to set the loggedin Status either true or false****/
  setLoginVal(val) {
    this.localstorage.setItem('isLoggedin', val).subscribe(() => { });
  }

  /******An Observable function to check Login status******/
  checkLoginVal(): Observable<any> {
    const checkdata = new Observable(observer => {
      /******get loging status from local storage*******/
      this.localstorage.getItem('isLoggedin')
        .subscribe((log: any) => {
          observer.next(log)
        }, (err) => {
          observer.next(false)
        });
    });
    return checkdata;
  }


  /***********Check admin authentication********** */
  public checkAdminLogin(values: any): Observable<any> {
    const checkdata = new Observable(observer => {
      //get the localstorage values of admin details
      this.localstorage.getItem('adminData')
        .subscribe((user: any) => {
          // condition to check default values and local storage valuew...
          if (values.username === user.username && values.password === user.password) {
            observer.next({ status: "success", message: "Login successfully done" })
          }
          else {
            observer.next({ status: "fail", message: "Invalid Username and Password" })
          }
        }, (err) => {
          observer.next({ status: "fail", message: "Something went wrong.... Please Try again later.." })
        });
    });
    return checkdata;
  }
}
