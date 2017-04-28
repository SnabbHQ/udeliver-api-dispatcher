import * as Pusher from 'pusher';

/**
 * Encapsulate pusher (websockets) so in case we need to perform a refactoring later on,
 * we might bet away but simply changing this class instead of everything.
 */
class WebSocket {
  private pusher;

  constructor() {
    this.pusher = new Pusher({
      appId: '328861',
      cluster: 'eu',
      encrypted: true,
      key: 'f0313bf24c4d0285f4c2',
      secret: '86f1f620d518b8e7fa75',
    });
  }

  public authenticate(socketId: string, channel: string, presenceData): void {
    this.pusher.authenticate(socketId, channel, presenceData);
  }

  public trigger(channel: string, eventName: string, data: object): void {
    this.pusher.trigger(channel, eventName, data);
  }
}

export default new WebSocket();
