import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SpaceModel } from 'src/app/models/space';
import { AreaService } from 'src/app/services/area.service';
import { SpaceService } from 'src/app/services/space.service';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements OnInit {

  @ViewChild('refCreateSpaceModal') refCreateSpaceModal!: ElementRef;

  private idUpdate: number = 0;

  public areaForm = this.fb.group({
    nombre: [[Validators.required]],
    capacidad: [[Validators.required, Validators.min(1)]],
    referencia: [],
    idubicacion: [,[Validators.required]],
  });

  public spaceForm = this.fb.group({
    identificador: [,[Validators.required]],
    tipo_de_espacio: [,[Validators.required]],
    cantidad_de_personas: [,[Validators.required, Validators.min(1)]],
    idsector: [,[Validators.required]]
  });

  public spaces: SpaceModel[] = [];

  public isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private areaService: AreaService,
    private fb: FormBuilder,
    private spaceService: SpaceService
  ) { }

  ngOnInit(): void {

    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');

    this.spaceForm.get('idsector')?.setValue(id);
    

    this.areaService.getArea(id)
      .subscribe({
        error: (err:any) => {
          console.log(err);
          this.isLoading = false;
        },
        next: (resp:any) => {
          this.areaForm.get('nombre')?.setValue(resp.nombre);
          this.areaForm.get('capacidad')?.setValue(resp.capacidad);
          this.areaForm.get('referencia')?.setValue(resp.referencia);
          this.areaForm.get('idubicacion')?.setValue(resp.idubicacion);
          
          this.spaces = resp.espacios;
          this.isLoading = false;
        }
      })
  }

  public deleteSpace = (space: SpaceModel) => {
    this.spaceService.deleteSpace(space.idespacio)
      .subscribe({
        error: (err:any) => {
          console.log(err);
        },
        complete: () => {
          this.spaces.splice(this.spaces.indexOf(space),1);
        }
      })
  }

  public updateSpace = (space: SpaceModel) => {
    this.spaceForm.get('identificador')?.setValue(space.identificador);
    this.spaceForm.get('tipo_de_espacio')?.setValue(space.tipo_de_espacio);
    this.spaceForm.get('cantidad_de_personas')?.setValue(space.cantidad_de_personas);
    this.idUpdate = space.idespacio;
    document.getElementById('refNewSpace')?.click();
  }

  public createSpace = () => {
    
    if (this.spaceForm.invalid) return;

    if (this.idUpdate === 0){
      this.spaceService.createSpace(this.spaceForm.value)
        .subscribe({
          error: (err:any) => {
            console.log(err);
          },
          next: (resp:any) => {
            this.spaces.push(resp);
            this.refCreateSpaceModal.nativeElement.click();
          }
        });
    }else{
      this.spaceService.updateSpace(this.spaceForm.value, this.idUpdate)
        .subscribe({
          error: (err:any) => {
            console.log(err);
            this.idUpdate = 0;
          },
          next: (resp:any) => {
            this.spaces.forEach((space: SpaceModel) => {
              if (space.idespacio === this.idUpdate){
                space.identificador = this.spaceForm.get('identificador')?.value;
                space.tipo_de_espacio = this.spaceForm.get('tipo_de_espacio')?.value;
                space.cantidad_de_personas = this.spaceForm.get('cantidad_de_personas')?.value;
                this.spaceForm.reset();
                const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');
                this.spaceForm.get('idsector')?.setValue(id);
                this.refCreateSpaceModal.nativeElement.click();
              }
            });
            this.idUpdate = 0;
          }
        });
    }

    
  }

  public updateArea = () => {

    

  }
}
