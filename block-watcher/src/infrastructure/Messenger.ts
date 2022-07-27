import { createSocket, Socket } from "dgram";

import { BlockData, Config } from "../types";

export default class Messenger {
  private _server: Socket;
  private _ports: string[];
  private _broadcastAddress: string;

  constructor({ ports, broadcastAddress }: Config) {
    this._server = createSocket("udp4");
    this._ports = ports.split(",");
    this._broadcastAddress = broadcastAddress;
  }

  bind() {
    var _this = this;
    this._server.on("listening", function () {
      _this._server.setBroadcast(true);
    });

    this._server.bind(parseInt(this._ports[0]));
  }

  broadcast(data: BlockData) {
    const message = Buffer.from(JSON.stringify(data));

    for (var i in this._ports) {
      const port = parseInt(this._ports[i]);
      this._server.send(message, 0, message.length, port, this._broadcastAddress);
    }
  }
}
