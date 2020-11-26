import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';    // local storage Module
import { LoginService } from '../services/loginservice/login.service';
import { MeetingsService } from '../services/meetingservice/meetings.service';
import { SearchService } from '../services/search/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  /*********Variables declaration start************/
  p: number = 1;
  searchText: any;
  searchRoute: boolean = false;

  /**********Variable declaration ends************/

  constructor(
    public localstorage: LocalStorage,
    private router: Router,
    public loginService: LoginService,
    public meetingService: MeetingsService,
    public searchService: SearchService,
    private _Activatedroute: ActivatedRoute,
  ) {

    /*********Function to Check Login status***********/
    this.loginService.checkLoginVal().subscribe((loggedIn) => {
      if (loggedIn === false) {
        this.router.navigate(['']);
      }
    }, (err) => {
      this.router.navigate(['']);
    });

    /****** Funciton to get Meeting Users******* */
    this.meetingService.getMeetingUsers().subscribe(() => {

      this.searchText = this._Activatedroute.snapshot.paramMap.get("searchtext");
      // Check serach text existing in the route...
      if (this.searchText) {
        this.searchRoute = true;
        this.searchService.searchUsers(this.searchText);   // if exists call search service
      }
    })
  }

  ngOnInit() {
  }

  // Function if search text is cleared
  changeSearch() {
    if (this.searchText.length == 0) {
      this.router.navigate(['/home']);
    }
    if (this.searchRoute) {
      this.searchService.searchUsers(this.searchText);
      this.router.navigate(['/home', this.searchText]);
    }
  }

}
