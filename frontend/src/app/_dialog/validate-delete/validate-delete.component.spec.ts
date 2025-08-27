import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateDeleteComponent } from './validate-delete.component';

describe('ValidateDeleteComponent', () => {
  let component: ValidateDeleteComponent;
  let fixture: ComponentFixture<ValidateDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
