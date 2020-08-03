import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForbidComponent } from './forbid.component';

describe('ForbidComponent', () => {
  let component: ForbidComponent;
  let fixture: ComponentFixture<ForbidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForbidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForbidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
