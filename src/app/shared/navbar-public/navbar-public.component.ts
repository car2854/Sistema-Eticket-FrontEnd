import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar-public',
  templateUrl: './navbar-public.component.html',
  styleUrls: ['./navbar-public.component.css']
})
export class NavbarPublicComponent implements OnInit {
  
  public showCategories: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
