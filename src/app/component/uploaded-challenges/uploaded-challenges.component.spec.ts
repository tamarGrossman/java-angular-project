import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedChallengesComponent } from './uploaded-challenges.component';

describe('UploadedChallengesComponent', () => {
  let component: UploadedChallengesComponent;
  let fixture: ComponentFixture<UploadedChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadedChallengesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadedChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
