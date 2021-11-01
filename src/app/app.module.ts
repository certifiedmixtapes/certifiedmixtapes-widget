import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { HomeComponent } from './home/home.component';
import { MarkdownModule } from 'ngx-markdown';
import { TopSongsComponent } from './top-songs/top-songs.component';
import { NgInitDirective } from './shared/nginit.directive';
import { WrapperComponent } from './wrapper/wrapper.component';



@NgModule({
  declarations: [
    AppComponent,
    AudioPlayerComponent,
    HomeComponent,
    NgInitDirective,
    WrapperComponent,
    TopSongsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatTableModule,
    MarkdownModule.forRoot(),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
