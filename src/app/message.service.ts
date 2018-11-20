import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages:string[]=[];

  clear(){
    this.messages=[];
  }
  add(message:string){
    this.messages.push(message);
  }

  constructor() { }
}
