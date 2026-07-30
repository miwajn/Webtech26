import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Termin } from './termin';

describe('Termin', () => {
  let component: Termin;
  let fixture: ComponentFixture<Termin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Termin],
    }).compileComponents();

    fixture = TestBed.createComponent(Termin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
