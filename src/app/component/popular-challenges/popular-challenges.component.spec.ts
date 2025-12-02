import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularChallengesComponent } from './popular-challenges.component';

describe('PopularChallengesComponent', () => {
  let component: PopularChallengesComponent;
  let fixture: ComponentFixture<PopularChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularChallengesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
