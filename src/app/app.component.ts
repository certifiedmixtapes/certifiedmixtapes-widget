import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'custom-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
  }
  
  title = 'cmtz-widget';
}
