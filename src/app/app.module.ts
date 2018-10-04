import { NgModule, CUSTOM_ELEMENTS_SCHEMA }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {DemoService} from './demo.service'

import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { AppComponent }  from './app.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
    imports: [BrowserModule, FormsModule,Ng2GoogleChartsModule, HttpClientModule,
        NgMultiSelectDropDownModule.forRoot()],
    declarations: [AppComponent],
    providers: [DemoService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]
})
export class AppModule { }
