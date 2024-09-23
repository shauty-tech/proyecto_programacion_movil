import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuEstudiantePage } from './menu-estudiante.page';

describe('MenuEstudiantePage', () => {
  let component: MenuEstudiantePage;
  let fixture: ComponentFixture<MenuEstudiantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuEstudiantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
