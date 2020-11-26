import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {
  public meetingUsers: any = [];
  public allMeetingUsers: any = [];
  constructor(
    public localstorage: LocalStorage
  ) {

  }

  /***********Function to get meeting users form localstorage******* */
  getMeetingUsers(): Observable<any> {
    const users = new Observable(observer => {
      //get the localstorage values of  meeting users
      this.localstorage.getItem('meetingUsers')
        .subscribe((user: any) => {
          //if meeting users empty JSON
          if (user == null) {
            this.meetingUsers = []
            this.allMeetingUsers = [];
            observer.next({ status: "success", meetingUsers: [], message: "Users found" });
          }
          else {
            this.meetingUsers = user;
            this.allMeetingUsers = user;
            observer.next({ status: "success", meetingUsers: user, message: "Users found" });
          }
        }, (err) => {
          observer.next({ status: "false", meetingUsers: [], message: "No Users found" });
        });
    });
    return users
  }

  /*********Function to save user data into localstorage********/
  saveMeetingUsers(userData): Observable<any> {
    const users = new Observable(observer => {
      this.meetingUsers.push(userData)
      this.localstorage.setItem('meetingUsers', this.meetingUsers).subscribe(() => {
        this.getMeetingUsers();
        observer.next({ status: "success", message: "User Saved Successfully" });
      }, (err) => {
        observer.next({ status: "fail", message: "Something error occured, Please try again" });
      });
    });
    return users
  }

  /*******Function to update user form meeting list to the localstorage*****/
  updateMeetingUsers(userData): Observable<any> {
    const users = new Observable(observer => {
      var index = this.getSingleUserIndex(userData.id);  // to get the index of the updating user in the list of JSON
      this.meetingUsers[index] = userData;
      this.localstorage.setItem('meetingUsers', this.meetingUsers).subscribe(() => {
        this.getMeetingUsers();
        observer.next({ status: "success", message: "User Saved Successfully" });
      }, (err) => {
        observer.next({ status: "fail", message: "Something error occured, Please try again" });
      });
    });
    return users
  }

  /********Get editign users object from meeting users JSON */
  getMatchingUser(meetingId) {
    return this.meetingUsers.filter((obj: any) => {
      return obj.id == meetingId
    })[0];
  }

  /*****Function to get Index to New Users.....****/
  getId() {
    if (this.meetingUsers.length > 0) {
      var index = this.meetingUsers.length - 1;
      return this.meetingUsers[index].id + 1;
    }
    else {
      return 1;
    }
  }

  /******Funciton to get updating user index value form Meeting users JSON Data... */
  getSingleUserIndex(id) {
    return this.meetingUsers.findIndex(x => x.id == id);
  }


}
