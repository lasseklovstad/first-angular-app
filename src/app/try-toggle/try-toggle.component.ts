import {Component, HostListener, OnInit, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogConfig} from '@angular/material';


class Image {
  file: string;
  name: string;
  width: number;
  height: number;
  //Megabyts
  size: number;

  public calcSize() {
    //MegaBytes
    this.size = this.file.length * 1.37 / 1024 / 1024;
  }
}

@Component({
  selector: 'app-try-toggle',
  templateUrl: './try-toggle.component.html',
  styleUrls: ['./try-toggle.component.css']
})
export class TryToggleComponent implements OnInit {

  toggle: boolean;
  images: Image[] = [];
  compressionWidth = 500;
  screenWidth = null;
  screenHeight = null;
  viewImage = false;
  selectedImage: Image;

  @ViewChild('secondDialog') secondDialog: TemplateRef<any>;

  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = this.screenWidth;
    dialogConfig.height = this.screenHeight;
    this.dialog.open(templateRef, dialogConfig);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
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

  public showImage(image: Image) {
    this.viewImage = true;
    this.selectedImage = image;
  }

  public closeImage() {
    this.viewImage = false;
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
        this.render.setAttribute(elem, 'width', this.compressionWidth.toString());
        this.render.setAttribute(elem, 'height', (this.compressionWidth * img.height / img.width).toString());
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, this.compressionWidth, this.compressionWidth * img.height / img.width);
        image.file = ctx.canvas.toDataURL('image/jpeg', 0.7);
        // Push compressed image to database and memory
        image.calcSize();
        this.images.push(image);
        this.http.put('/image', {image}).subscribe(res => {
          console.log('posted Image');
        });
      };


    };
    fileReader.readAsDataURL(file);


  }

  public rotate() {
    const img = this.render.createElement('img');
    this.render.setAttribute(img, 'src', this.selectedImage.file);

    img.onload = () => {
      this.selectedImage.height = img.width;
      this.selectedImage.width = img.height;

      const elem = this.render.createElement('canvas');
      this.render.setAttribute(elem, 'width', img.height);
      this.render.setAttribute(elem, 'height', img.width);
      const ctx = elem.getContext('2d');
      ctx.translate(img.height / 2, img.width / 2);
      ctx.rotate(Math.PI / 2);
      ctx.translate(-img.width / 2, -img.height / 2);
      ctx.drawImage(img, 0, 0, img.width, img.height);
      // use png not to reduce quality
      this.selectedImage.file = ctx.canvas.toDataURL('image/jpeg', 0.7);
      // Push compressed image to database and memory
      this.selectedImage.calcSize();

    };
  }

  plussCompression() {
    this.compressionWidth += 50;
  }

  minusCompression() {
    this.compressionWidth -= 50;
  }
}
