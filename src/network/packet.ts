export class DataPacket{
    static readonly PACKET_START = 0x1234567;
    static readonly PACKET_END = 0x89ABCDEF;
    static readonly HEADER_LENGTH = 16;

    constructor(readonly id: number, readonly data: Buffer, readonly metadata: Buffer){}
    
    static decode(buffer: Buffer): DataPacket|undefined{
        if(buffer.length < this.HEADER_LENGTH){
            return;
        }
        const id = buffer.readUInt16BE(4);
        const metadataLength = buffer.readUInt16BE(6);
        const dataLength = buffer.readUInt32BE(8);
        if(buffer.length !== this.HEADER_LENGTH + metadataLength + dataLength){
            return;
        }
        const metadata = buffer.slice(12, 12 + metadataLength);
        const data = buffer.slice(12 + metadataLength, 12 + metadataLength + dataLength);
        if(buffer.readUInt32BE() !== this.PACKET_START || buffer.readUInt32BE(12 + metadataLength + dataLength) !== this.PACKET_END){
            return;
        }
        return new DataPacket(id, data, metadata);
    }

    encode(): Buffer{
        const buffer = Buffer.allocUnsafe(DataPacket.HEADER_LENGTH + this.metadata.length + this.data.length);
        buffer.writeUint32BE(DataPacket.PACKET_START);
        buffer.writeUInt16BE(this.id, 4);
        buffer.writeUInt16BE(this.metadata.length, 6);
        buffer.writeUInt32BE(this.data.length, 8);
        this.metadata.copy(buffer, 12);
        this.data.copy(buffer, 12 + this.metadata.length);
        buffer.writeUint32BE(DataPacket.PACKET_END, 12 + this.metadata.length + this.data.length);
        return buffer;
    }
}

export class HandshakePacket{
    static readonly PACKET_LENGTH = 20;

    static readonly CONNECT_START = 0x000000ff;
    static readonly CONNECT_END = 0xffffffff;
    static readonly CONNECT_DATA = 255;

    static readonly ESTABLISH_START = 0x00000145;
    static readonly ESTABLISH_END = 0x14514545;

    static readonly DISCONNECT_START = 0x00000194;
    static readonly DISCONNECT_END = 0x19419494;

    constructor(readonly start: number, readonly param1: number, readonly param2: number, readonly data: number, readonly end: number){}

    static decode(buffer: Buffer): HandshakePacket|undefined
    {
        if(buffer.length !== HandshakePacket.PACKET_LENGTH){
            return;
        }
        const handshake = new HandshakePacket(buffer.readUInt32BE(), buffer.readUInt32BE(4), buffer.readUInt32BE(8), buffer.readUInt32BE(12), buffer.readUInt32BE(16));
        if(handshake.start === HandshakePacket.CONNECT_START && handshake.end === HandshakePacket.CONNECT_END && handshake.data === HandshakePacket.CONNECT_DATA){
            return new Connect();
        }else if(handshake.start === HandshakePacket.ESTABLISH_START && handshake.end === HandshakePacket.ESTABLISH_END && handshake.data === HandshakePacket.CONNECT_DATA){
            return new Establish(handshake.param1, handshake.param2);
        }else if(handshake.start === HandshakePacket.DISCONNECT_START && handshake.end === HandshakePacket.DISCONNECT_END && handshake.data === HandshakePacket.CONNECT_DATA){
            return new Disconnect();
        }else{
            return;
        }
    }

    encode(): Buffer{
        const buffer = Buffer.allocUnsafe(HandshakePacket.PACKET_LENGTH);
        buffer.writeUInt32BE(this.start);
        buffer.writeUInt32BE(this.param1, 4);
        buffer.writeUInt32BE(this.param2, 8);
        buffer.writeUInt32BE(this.data, 12);
        buffer.writeUInt32BE(this.end, 16);
        return buffer;
    }
}

export class Connect extends HandshakePacket
{
    constructor(){
        super(HandshakePacket.CONNECT_START, 0, 0, HandshakePacket.CONNECT_DATA, HandshakePacket.CONNECT_END);
    }
}

export class Establish extends HandshakePacket
{
    constructor(readonly conv: number, readonly token: number){
        super(HandshakePacket.ESTABLISH_START, conv, token, HandshakePacket.CONNECT_DATA, HandshakePacket.ESTABLISH_END);
    }
}

export class Disconnect extends HandshakePacket
{
    constructor(){
        super(HandshakePacket.DISCONNECT_START, 0, 0, HandshakePacket.CONNECT_DATA, HandshakePacket.DISCONNECT_END);
    }
}