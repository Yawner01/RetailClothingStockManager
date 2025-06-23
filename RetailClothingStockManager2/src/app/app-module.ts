import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

import { App } from './app';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
