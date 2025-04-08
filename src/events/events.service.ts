import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class EventsService {
  constructor(private readonly eventsGateway: EventsGateway) {}

  emitUserAction(userId: string, action: string) {
    const message = `User ${userId} performed action: ${action}`;
    this.eventsGateway.server.emit('userAction', { message });
  }
}
