import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.css']
})
export class EmptyComponent implements OnInit {

  @Input() title: string = 'No hay datos';

  constructor() { }

  ngOnInit(): void {
  }

}
