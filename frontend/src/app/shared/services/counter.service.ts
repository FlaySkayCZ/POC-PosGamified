import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private counter = 0;

  constructor() {}

  incrementCounter() {
    this.counter++;
  }

  getCounterValue() {
    return this.counter;
  }
}
