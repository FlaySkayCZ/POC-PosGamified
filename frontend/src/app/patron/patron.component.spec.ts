import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatronComponent } from './patron.component';

describe('PatronComponent', () => {
  let component: PatronComponent;
  let fixture: ComponentFixture<PatronComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatronComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
