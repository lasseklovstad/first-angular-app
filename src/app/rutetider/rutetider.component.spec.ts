import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RutetiderComponent } from './rutetider.component';

describe('RutetiderComponent', () => {
  let component: RutetiderComponent;
  let fixture: ComponentFixture<RutetiderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RutetiderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RutetiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
