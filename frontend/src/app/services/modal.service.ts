import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  open() {
    console.log('Modal opened');
  }
  close() {
    console.log('Modal closed');
  }
}
