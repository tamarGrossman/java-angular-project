import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeLikeComponent } from './challenge-like.component';

describe('ChallengeLikeComponent', () => {
  let component: ChallengeLikeComponent;
  let fixture: ComponentFixture<ChallengeLikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeLikeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
