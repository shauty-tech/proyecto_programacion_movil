import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerAsistenciaEstudiantePage } from './ver-asistencia-estudiante.page';

describe('VerAsistenciaEstudiantePage', () => {
  let component: VerAsistenciaEstudiantePage;
  let fixture: ComponentFixture<VerAsistenciaEstudiantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerAsistenciaEstudiantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
