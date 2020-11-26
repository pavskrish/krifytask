import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { AppGlobals } from '../app.globals';
import { ActivatedRoute } from '@angular/router';
import *  as  codes from '../CountryCodes.json';   // import country code json
import { MeetingsService } from '../services/meetingservice/meetings.service';
import { LoginService } from '../services/loginservice/login.service';
import { DateButton } from 'angular-bootstrap-datetimepicker';
import * as _moment from 'moment';
import { unitOfTime } from 'moment';

let moment = _moment;

if ('default' in _moment) {
  moment = _moment['default'];
}

declare var $: any;

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit {
  /************** Variables declarations starts *************/

  meetingForm: FormGroup;
  countrycodes: any = (codes as any).default;
  submitted = false;
  errorMsg: boolean;
  meetingId: any;
  createMeet: boolean;
  selected: any;
  editUser: any;
  errorMsgText: any;
  disablePastDates = true;
  enteredDate: Date;
  private _isPickerOpen = false;

  /*************variables declaration ends****************/
  constructor(
    public localstorage: LocalStorage,
    public router: Router,
    public globals: AppGlobals,
    private _Activatedroute: ActivatedRoute,
    private meetingService: MeetingsService,
    private loginService: LoginService,
    private _elementRef: ElementRef
  ) {

    /*****Check meeting id existing in the path if exists form is edit meeting*******/
    this.meetingId = this._Activatedroute.snapshot.paramMap.get("id");
    if (this.meetingId)
      this.createMeet = false
    else
      this.createMeet = true;

    /*********Function to check Admin login status***********/
    this.loginService.checkLoginVal().subscribe((loggedIn) => {
      if (loggedIn === false) {
        this.router.navigate(['']);
      }
    }, (err) => {
      this.router.navigate(['']);
    })

    /***Function to get meeting users*****/
    this.meetingService.getMeetingUsers().subscribe((resp: any) => {
      if (resp.status == "success") {
        if (resp.meetingUsers.length > 0) {
          // Get meeting user while id in the route param.
          this.editUser = this.meetingService.getMatchingUser(this.meetingId);
          if (!this.editUser && this.createMeet == false) {
            this.router.navigate(['/home']);
            alert("User not found")
          }
          this.setUpdateForm();  // call functin to assign edite user details...
        }
      }
    })
  }

  // Methode to return controls for the meeting form
  get f() { return this.meetingForm.controls; }

  ngOnInit() {
    // initialize meeting form....
    this.meetingForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.pattern(this.globals.emailReg)]),
      countrycode: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern(this.globals.phoneReg), Validators.maxLength(this.globals.PhoneMaxLength), Validators.minLength(this.globals.phoneMinLength)]),
      address: new FormControl('', [Validators.required]),
      meetingtime: new FormControl(null, [Validators.required]),
    });

  }
  ngAfterViewInit(): void {
    /****Initialize date time picker */
    const dropdownToggle = $('[data-toggle="dropdown"]', this._elementRef.nativeElement);
    dropdownToggle.parent().on('show.bs.dropdown', () => {
      this._isPickerOpen = true;
    });
    dropdownToggle.parent().on('hide.bs.dropdown', () => {
      this._isPickerOpen = false;
    });
  }

  /******Function to disable past dats****** */
  dateInputFilter = (value: (number | null)) => {
    return this.disablePastDates
      ? value >= moment().valueOf()
      : true;
  }

  /*******Function to filter dates in picker******/
  datePickerFilter = (dateButton: DateButton, viewName: string) => {
    return this.disablePastDates
      ? dateButton.value >= moment().startOf(viewName as unitOfTime.StartOf).valueOf()
      : true;
  }

  /***function to dropdown picker*** */
  keepDropDownOpen(event: Event) {
    event.stopPropagation();
  }

  /******function to toggle after date selected******/
  dateSelected(event: any) {
    if (this._isPickerOpen && event.value) {
      $('.date-dropdown').dropdown('toggle');
    }
  }

  /*******Funciton to set selected meeting details to Meeting Form****/
  setUpdateForm() {
    if (this.createMeet == false) {
      this.meetingForm.patchValue({
        firstname: this.editUser.firstname,
        lastname: this.editUser.lastname,
        email: this.editUser.email,
        countrycode: this.editUser.countrycode,
        phone: this.editUser.phone,
        address: this.editUser.address,
        meetingtime: this.editUser.meetingtime
      })
    }
  }

  /******Methode to get country code value from JSON;****/
  public onOptionsSelected(event) {
    const value = event.target.value;
    this.meetingForm.value.countrycode = value;
    this.selected = value;
  }


  /**********Function to save new meeting for user******/
  public saveMeeting() {
    this.submitted = true;
    console.log(this.meetingForm)
    //To check form is valid or not....
    if (this.meetingForm.valid) {

      var formdata = this.meetingForm.value;

      //set the values for object
      var savedData = {
        id: this.meetingService.getId(),
        firstname: formdata.firstname,
        lastname: formdata.lastname,
        email: formdata.email,
        phone: formdata.phone,
        countrycode: formdata.countrycode,
        address: formdata.address,
        meetingtime: formdata.meetingtime
      }

      // Methode to save meeting details into localstorage
      this.meetingService.saveMeetingUsers(savedData).subscribe((resp: any) => {
        if (resp.status == "success") {
          this.router.navigate(['/home']);  // navigate to home page...
        }
        else {
          this.errorMsg = true;
          this.errorMsgText = resp.message;
        }
      })
    }
    else {
      //Displaying error message while form is invalid
      this.errorMsg = true;
      if (this.f.meetingtime.errors.required) {
        //  alert("Please select meeting date time")
      }
      this.errorMsgText = "Please Fill All Required Fields  with Valid data"
    }
  }

  /*******Update user meeting details************/
  public updateMeeting() {
    this.submitted = true;
    //Check form Validation
    if (this.meetingForm.valid) {
      var formdata = this.meetingForm.value;
      //set the values for object
      var savedData = {
        id: this.editUser.id,
        firstname: formdata.firstname,
        lastname: formdata.lastname,
        email: formdata.email,
        phone: formdata.phone,
        countrycode: formdata.countrycode,
        address: formdata.address,
        meetingtime: formdata.meetingtime
      }
      this.meetingService.updateMeetingUsers(savedData).subscribe((resp: any) => {
        if (resp.status == "success") {
          this.router.navigate(['/home']);
        }
        else {
          this.errorMsg = true;
          this.errorMsgText = resp.message;
        }
      })
    }
    else {
      // displaying error meessage for invalid form data.....
      this.errorMsg = true;
      this.errorMsgText = "Please Fill All Required Fields  with Valid data"
    }
  }
}
