import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllChallengeComponent } from './all-challenge.component';

describe('AllChallengeComponent', () => {
  let component: AllChallengeComponent;
  let fixture: ComponentFixture<AllChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllChallengeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
