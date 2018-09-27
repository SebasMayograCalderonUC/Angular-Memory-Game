import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { CuadrillaComponent } from './cuadrilla/cuadrilla.component';


@NgModule({
  declarations: [
    AppComponent,
    CuadrillaComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
