import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmUser } from './confirm-user';

describe('ConfirmUser', () => {
  let component: ConfirmUser;
  let fixture: ComponentFixture<ConfirmUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmUser],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
