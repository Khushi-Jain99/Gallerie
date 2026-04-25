import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGalleryComponent } from './my-gallery.component';

describe('MyGalleryComponent', () => {
  let component: MyGalleryComponent;
  let fixture: ComponentFixture<MyGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyGalleryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
