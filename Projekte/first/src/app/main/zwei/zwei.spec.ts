import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Zwei } from './zwei';

describe('Zwei', () => {
  let component: Zwei;
  let fixture: ComponentFixture<Zwei>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Zwei],
    }).compileComponents();

    fixture = TestBed.createComponent(Zwei);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
