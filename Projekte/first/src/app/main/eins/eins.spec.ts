import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Eins } from './eins';

describe('Eins', () => {
  let component: Eins;
  let fixture: ComponentFixture<Eins>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Eins],
    }).compileComponents();

    fixture = TestBed.createComponent(Eins);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
