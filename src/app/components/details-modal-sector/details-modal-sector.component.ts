import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketDataService } from 'src/app/services/dataServices/ticket-data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-details-modal-sector',
  templateUrl: './details-modal-sector.component.html',
  styleUrls: ['./details-modal-sector.component.css']
})
export class DetailsModalSectorComponent implements OnInit {

  @ViewChild('refClose') refClose!: ElementRef;

  public withSectorForm = this.fb.group({
    cantidad: [0,[Validators.required, Validators.min(1)]],
    idSector: [0, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    public ticketDataService: TicketDataService
  ) { }

  ngOnInit(): void {
  }

  public addSector = () => {

    if (this.withSectorForm.invalid) return;

    const idSector = parseInt(this.withSectorForm.get('idSector')?.value);
    const amount = parseInt(this.withSectorForm.get('cantidad')?.value);

    this.ticketDataService.addAggregateSector(idSector, amount, 5.0);

  }

  public deleteSector = (idSector: number) => {
    this.ticketDataService.deleteSector(idSector);
  }

  public goPayS = () => {
    if (this.ticketDataService.aggregateSectors.length === 0) return;

    this.ticketDataService.goPay = true;
    if (this.userService.user.token != 'no-token'){
      this.router.navigateByUrl('/public/completar-pago');
    }else{
      this.router.navigateByUrl('/auth/login');
    }
    this.refClose.nativeElement.click();
  }

}
