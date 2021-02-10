import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';
import {delay, switchMap, tap} from 'rxjs/operators'

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    frontera: ['', [Validators.required]]
  });

  //llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];


  //ui
  cargando:boolean = false;

  constructor(private fb: FormBuilder,
              private paisesServices: PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesServices.regiones;

    //cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
    .pipe(

      tap( (_) => {

        this.miFormulario.get('pais')?.reset('');
        this.paises = [];
        this.cargando = true;
      }),
      delay(500),
      switchMap(region => this.paisesServices.getPaisesPorRegion(region))
      
    )
    .subscribe(paises =>{

      this.paises = paises;
      this.cargando = false;
    });

    //cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
    .pipe(

      tap( (_) => {

        this.miFormulario.get('frontera')?.reset('');
        this.fronteras = [];
        this.cargando = true;
      }),
      delay(500),
      switchMap( codigo => this.paisesServices.getPaisPorCodigo(codigo)),
      switchMap(pais => this.paisesServices.getPaisesPorCodigos(pais?.borders!))

    )
    .subscribe( paises => {
      
      // this.fronteras = pais?.borders || [];
      this.fronteras = paises;
      this.cargando = false;
    });
  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}
