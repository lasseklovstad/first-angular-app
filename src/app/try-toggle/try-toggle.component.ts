import {Component, OnInit, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material';

class Image {
  file: string;
  name: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-try-toggle',
  templateUrl: './try-toggle.component.html',
  styleUrls: ['./try-toggle.component.css']
})
export class TryToggleComponent implements OnInit {

  toggle: boolean;
  images: Image[] = [];

  @ViewChild('secondDialog') secondDialog: TemplateRef<any>;

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    this.dialog.open(templateRef, dialogConfig);
  }

  constructor(private location: Location, private http: HttpClient, private render: Renderer2,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.fetch();
  }


  public fetch() {
    this.http.get<boolean>('/toggle').subscribe((response) => {
      this.toggle = response;
    });
    this.http.get<Image[]>('/image').subscribe((response) => {
      this.images = response;
    });
  }

  public refresh() {
    this.fetch();
  }

  public goBack() {
    this.location.back();
  }

  public updateToggle() {
    this.http.put<boolean>('/toggle', '').subscribe(res => {
      this.toggle = res;
    });

  }

  public update() {
    navigator.serviceWorker.controller.postMessage('replayRequests');
  }

  public onImageChange(event) {
    const file = event.target.files[0];


    const fileReader = new FileReader();
    fileReader.onload = (evt: any) => {
      const image = new Image();
      image.name = file.name;


      const img = this.render.createElement('img');
      this.render.setAttribute(img, 'src', evt.target.result);

      img.onload = () => {
        image.width = img.width;
        image.height = img.height;

        const elem = this.render.createElement('canvas');
        this.render.setAttribute(elem, 'width', '100');
        this.render.setAttribute(elem, 'height', (100 * img.height / img.width).toString());
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, 100, 100 * img.height / img.width);
        image.file = ctx.canvas.toDataURL('image/jpeg', 1);
        // Push compressed image to database and memory

        this.images.push(image);
        this.http.put('/image', {image}).subscribe(res => {
          console.log('posted Image');
        });
      };


    };
    fileReader.readAsDataURL(file);


  }
}
