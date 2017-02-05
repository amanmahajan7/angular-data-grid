import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { headerComponents } from '../../../src/header';
import { BasicExampleComponent } from './basic-example/basic-example.component'

@NgModule({
  declarations: [
    AppComponent,
    headerComponents,
    BasicExampleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
