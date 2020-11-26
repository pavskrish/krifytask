import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { NgxPaginationModule } from 'ngx-pagination';
import { DlDateTimeDateModule, DlDateTimeInputModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';

/******Components which are used in the application*********/
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MeetingComponent } from './meeting/meeting.component';
import { AppGlobals } from './app.globals';

/*******Import services************/
import { LoginService } from './services/loginservice/login.service';
import { MeetingsService } from './services/meetingservice/meetings.service';

/*******import custom pipes**** */
import { IndPipe } from './pipes/index/ind.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MeetingComponent,
    IndPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2TelInputModule,
    GooglePlaceModule,
    NgxPaginationModule,
    DlDateTimeDateModule,  // <--- Determines the data type of the model
    DlDateTimePickerModule,
    DlDateTimeInputModule

  ],
  providers: [
    LocalStorage,
    LoginService,
    MeetingsService,
    AppGlobals
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
