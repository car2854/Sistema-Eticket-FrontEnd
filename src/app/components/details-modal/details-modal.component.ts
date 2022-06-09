import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketDataService } from 'src/app/services/dataServices/ticket-data.service';

import { UserService } from 'src/app/services/user.service';



@Component({
  selector: 'app-details-modal',
  templateUrl: './details-modal.component.html',
  styleUrls: ['./details-modal.component.css']
})
export class DetailsModalComponent implements OnInit {

  @ViewChild('refClose') refClose!: ElementRef;

  public withoutSectorForm = this.fb.group({
    cantidad: [0,[Validators.required, Validators.min(1)]]
  });

  constructor(
    private userService: UserService,
    private router: Router,
    public ticketDataService: TicketDataService,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  // para ticket sin sectores

  public getPrice = () => {
    return this.withoutSectorForm.get('cantidad')?.value * 12.0;
  }

  public goPaySs = () => {

    if (this.withoutSectorForm.get('cantidad')?.invalid) return;

    this.ticketDataService.goPay = true;
    if (this.userService.user.token != 'no-token'){
      this.router.navigateByUrl('/public/completar-pago');
    }else{
      this.router.navigateByUrl('/auth/login');
    }
    this.refClose.nativeElement.click();
  }

}
