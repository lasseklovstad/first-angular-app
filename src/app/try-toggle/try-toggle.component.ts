import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';

class Image {
  file: string;
  name: string;
}

@Component({
  selector: 'app-try-toggle',
  templateUrl: './try-toggle.component.html',
  styleUrls: ['./try-toggle.component.css']
})
export class TryToggleComponent implements OnInit {

  toggle: boolean;
  images: Image[] = [];

  constructor(private location: Location, private http: HttpClient) {
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
      image.file = evt.target.result;
      image.name = file.name;
      this.images.push(image);
      console.log(image);

      this.http.put('/image', {image}).subscribe(res => {
        console.log('posted Image');
      });

    };
    fileReader.readAsDataURL(file);


  }
}
