import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TryToggleComponent } from './try-toggle.component';

describe('TryToggleComponent', () => {
  let component: TryToggleComponent;
  let fixture: ComponentFixture<TryToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TryToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TryToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
