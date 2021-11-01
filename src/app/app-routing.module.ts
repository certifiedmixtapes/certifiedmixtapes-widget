import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { HomeComponent } from './home/home.component';
import { TopSongsComponent } from './top-songs/top-songs.component';
import { WrapperComponent } from './wrapper/wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: WrapperComponent,
    children: [{ path: '', component: HomeComponent }],
  },
  { path: ':type/:id', component: AudioPlayerComponent },
  //{ path: 'songs', component: TopSongsComponent },
  {
    path: '',
    component: WrapperComponent,
    children: [{ path: 'songs', component: TopSongsComponent }],
  },

];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes,{
    useHash: false,
     scrollPositionRestoration: 'enabled',
      initialNavigation: 'enabled',
       relativeLinkResolution: 'legacy'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
