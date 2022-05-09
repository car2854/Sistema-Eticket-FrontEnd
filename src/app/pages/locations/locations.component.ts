import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateModel } from 'src/app/models/date';
import { SectorModel } from 'src/app/models/sector';
import { LocationService } from 'src/app/services/location.service';
import { SectorService } from 'src/app/services/sector.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  @ViewChild('refDateModal') refDateModal!: ElementRef;
  @ViewChild('refSectorModal') refSectorModal!: ElementRef;

  public locationForm = this.fb.group({
    cantidad_de_personas: [,[Validators.required]],
    direccion: [,[Validators.required]], 
    latitud: [0,[Validators.required]], 
    longitud: [0,[Validators.required]], 
  });

  public sectorForm = this.fb.group({
    nombre: [,[Validators.required]],
    capacidad: [,[Validators.required, Validators.min(1)]],
    referencia: [],
    idubicacion: [,[Validators.required]],
  });

  public dateForm = this.fb.group({
    fecha_hora: [,[Validators.required]],
    idubicacion: [,[Validators.required]]
  });

  public dates: DateModel[] = [];
  public sectors: SectorModel[] = [];

  private loading: boolean[] = [true];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private locationService: LocationService,
    private sectorService: SectorService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');

    this.dateForm.get('idubicacion')?.setValue(id);
    this.sectorForm.get('idubicacion')?.setValue(id);
    

    this.locationService.getLocation(id)
      .subscribe({
        error: (err:any) => {
          console.log(err);
          this.loading[0] = false;
        },
        next: (resp:any) => {
          this.dates = resp.horarios;
          this.sectors = resp.sectors;
          
          this.locationForm.get('cantidad_de_personas')?.setValue(resp.cantidad_de_personas);``
          this.locationForm.get('direccion')?.setValue(resp.direccion);
          this.locationForm.get('latitud')?.setValue(resp.latitud);
          this.locationForm.get('longitud')?.setValue(resp.longitud);

          this.loading[0] = false;
        }
      });

  }

  public deleteSector = (sector: SectorModel) => {
    this.sectorService.deleteSector(sector.idsector)
      .subscribe({
        error: (err:any) => {
          console.log(err);
        },
        complete: () => {
          this.sectors.splice(this.sectors.indexOf(sector), 1)
        }
      })
  }

  public deleteDate = (date: DateModel) => {
    this.locationService.deleteDate(date.idhorario)
    .subscribe({
      error: (err:any) => {
        console.log(err);
      },
      complete: () => {
        this.dates.splice(this.dates.indexOf(date), 1);
      }
      });
    }
    
    public isLoading = () => {
      return this.loading.includes(true);
  }
  
  public addDate = () => {
    const date:any = document.getElementById('refDate');
    this.dateForm.get('fecha_hora')?.setValue(date.value);
    if (this.dateForm.invalid) return;
    this.locationService.addDate(this.dateForm.value)
      .subscribe({
        error: (err:any) => {
          console.log(err);
        },
        next: (resp:any) => {
          console.log(resp);
          this.dates.push(resp);
          this.refDateModal.nativeElement.click();
        }
      });
  
  }

  public createSector = () => {
    if (this.sectorForm.invalid) return;

    this.sectorService.createSector(this.sectorForm.value)
      .subscribe({
        error: (err:any) => {
          console.log(err);
        },
        next: (resp:any) => {
          this.sectors.push(resp);
          this.refSectorModal.nativeElement.click();
          this.router.navigateByUrl(`/dashboard/area/${resp.idsector}`);
        }
      });
  }
}
