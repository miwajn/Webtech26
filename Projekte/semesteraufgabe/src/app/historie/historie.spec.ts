import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Historie } from './historie';

describe('Historie', () => {
  let component: Historie;
  let fixture: ComponentFixture<Historie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Historie],
    }).compileComponents();

    fixture = TestBed.createComponent(Historie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
