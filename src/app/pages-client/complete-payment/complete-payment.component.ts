import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { errorHelpers } from 'src/app/helpers/helpers';
import { PayModel } from 'src/app/models/pay';
import { TicketDataService } from 'src/app/services/dataServices/ticket-data.service';
import { PayService } from 'src/app/services/pay.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-complete-payment',
  templateUrl: './complete-payment.component.html',
  styleUrls: ['./complete-payment.component.css']
})
export class CompletePaymentComponent implements OnInit {

  public userDataForm = this.fb.group({
    nombres: [,[Validators.required]],
    apellidos: [,[Validators.required]],
    telefono: [,[Validators.required]],
    email: [,[Validators.required]],
    tipoPago: [0,[Validators.required, Validators.min(1)]]
  });

  public isSubmit: boolean = false;
  public isLoading: boolean = true;
  public payModel: PayModel[] = [];

  constructor(
    private fb: FormBuilder,
    private payService: PayService,
    private router: Router,
    public ticketDataService: TicketDataService,
  ) { }

  ngOnInit(): void {

    if (!this.ticketDataService.event) this.router.navigateByUrl('/public/eventos');

    this.payService.getPaymentType()
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
          this.isLoading = false;
        },
        next: (resp:any) => {
          this.payModel = resp;
          this.isLoading = false;
          
        }
      });

    // Sin sectore
    if (this.ticketDataService.withoutSector){

      console.log(this.ticketDataService.cantidad);
      console.log(this.ticketDataService.location);
      console.log(this.ticketDataService.date);
      

    }

  }


  public completePayment = () => {

    if (this.userDataForm.invalid) return;

    this.isSubmit = true;

    const data = {
      DatosUsuario: this.userDataForm.value,
      DatosCompra: {
        tipoPago: this.userDataForm.get('tipoPago')?.value,
        idhorario: this.ticketDataService.date.idhorario,
        idubicacion: this.ticketDataService.location.idubicacion,
        idevento: this.ticketDataService.event.idevento,
        cantidad: this.ticketDataService.cantidad
      }
    }

    this.payService.pay(data)
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
          this.isSubmit = false;
        },
        next: (resp:any) => {
          this.isSubmit = false;
          Swal.fire(
            'Completado!',
            resp.message,
            'success'
          )
          this.router.navigateByUrl('/public/eventos');
        }
      });
  }
}
