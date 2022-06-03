import { Component, OnInit } from '@angular/core';
import { ErrorDataService } from '../services/dataServices/error-data.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(
    public errorDataService: ErrorDataService
  ) { }

  ngOnInit(): void {
  }

}
