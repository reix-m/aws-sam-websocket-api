import { Event } from '../models/event.model';

export class SendEventPort {
  public event: Event;

  constructor(data: SendEventPort) {
    this.event = data.event;
  }
}
