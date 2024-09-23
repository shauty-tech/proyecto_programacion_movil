import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarCamaraPage } from './registrar-camara.page';

describe('RegistrarCamaraPage', () => {
  let component: RegistrarCamaraPage;
  let fixture: ComponentFixture<RegistrarCamaraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarCamaraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
