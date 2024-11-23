import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngresarAsignaturaPage } from './ingresar-asignatura.page';

describe('IngresarAsignaturaPage', () => {
  let component: IngresarAsignaturaPage;
  let fixture: ComponentFixture<IngresarAsignaturaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresarAsignaturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
