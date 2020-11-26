import { Injectable } from '@angular/core';
import { MeetingsService } from '../meetingservice/meetings.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    public meetingService: MeetingsService
  ) {

  }

  /******Funtion to search meeting users based on first name, last name, email,phone number ****/
  public searchUsers(searchText) {
    //If search text exists
    if (searchText) {
      this.meetingService.meetingUsers = this.meetingService.allMeetingUsers.filter((obj) => {
        var return_data;
        return_data = (obj.firstname.toLowerCase().indexOf(searchText.toLowerCase()) > -1 || obj.lastname.toLowerCase().indexOf(searchText.toLowerCase()) > -1 || obj.phone.indexOf(searchText) > -1 || obj.email.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
        return return_data;
      })
    }
    else {
      this.meetingService.meetingUsers = this.meetingService.allMeetingUsers
    }
  }
}
