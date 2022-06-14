import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { errorHelpers } from 'src/app/helpers/helpers';
import { SpaceModel } from 'src/app/models/space';
import { TicketDataService } from 'src/app/services/dataServices/ticket-data.service';
import { SectorService } from 'src/app/services/sector.service';
import { SpaceService } from 'src/app/services/space.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-details-modal-sector',
  templateUrl: './details-modal-sector.component.html',
  styleUrls: ['./details-modal-sector.component.css']
})
export class DetailsModalSectorComponent implements OnInit {

  @ViewChild('refClose') refClose!: ElementRef;

  public isClear: boolean = true;

  public withSectorForm = this.fb.group({
    cantidad: [0,[]],
    idSector: [0, [Validators.required, Validators.min(1)]]
  });

  public spaces!: SpaceModel[];
  public isLoadingData: boolean = false;
  public spaceSector: number = 0;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private spaceService: SpaceService,
    private sectorService: SectorService,
    public ticketDataService: TicketDataService
  ) { }

  ngOnInit(): void {
  }

  public addSector = () => {

    if (this.withSectorForm.invalid) return;


    const idSector = parseInt(this.withSectorForm.get('idSector')?.value);
    const amount = parseInt(this.withSectorForm.get('cantidad')?.value);
    
    if (!this.ticketDataService.existSector(idSector)){
      this.ticketDataService.addAggregateSector(idSector, amount);
  
      this.withSectorForm.get('idSector')?.setValue(0);
      this.withSectorForm.get('cantidad')?.setValue(0);
      this.isClear = true;
    }

  }

  public deleteSector = (idSector: number) => {
    this.ticketDataService.deleteSector(idSector);
  }

  public changeSector = () => {
    if (this.withSectorForm.get('idSector')?.invalid) return;

    this.isLoadingData = true;
    this.isClear = false;

    const id = parseInt(this.withSectorForm.get('idSector')?.value || '0');

    this.spaceService.getSpacePublic(id, this.ticketDataService.date.idhorario)
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
          this.isLoadingData = false;

        },
        next: (resp:any) => {
          
          if (resp.length > 0){
            // Tiene espacios
            console.log(resp);
            this.spaces = resp;
            this.isLoadingData = false;

          }else{
            // No tiene espacios
            this.spaces = [];
            this.sectorService.ticketsAvailablePublic(id, this.ticketDataService.date.idhorario)
              .subscribe({
                error: (err:any) => {
                  errorHelpers(err);
                  this.isLoadingData = false;
                },
                next: (resp:any) => {
                  console.log(resp);
                  this.spaceSector = resp;
                  this.isLoadingData = false;
                }
              });
          }
        }
      });   
    
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
