import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { AppComponent } from './components/app/app.component';
import { MapComponent } from './components/map/map.component';
import { MenuComponent } from './components/menu/menu.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './redux/redux';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MenuComponent,
    TooltipComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDa40RmrAD1gBmz-KCRQ9TKOMZDbuWGrXw'
    }),
    StoreModule.provideStore(reducer)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
