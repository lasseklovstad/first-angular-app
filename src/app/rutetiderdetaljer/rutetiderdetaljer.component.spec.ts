import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RutetiderdetaljerComponent } from './rutetiderdetaljer.component';

describe('RutetiderdetaljerComponent', () => {
  let component: RutetiderdetaljerComponent;
  let fixture: ComponentFixture<RutetiderdetaljerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RutetiderdetaljerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RutetiderdetaljerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
