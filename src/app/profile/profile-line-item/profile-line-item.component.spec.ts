import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLineItemComponent } from './profile-line-item.component';

describe('ProfileLineItemComponent', () => {
  let component: ProfileLineItemComponent;
  let fixture: ComponentFixture<ProfileLineItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileLineItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileLineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
