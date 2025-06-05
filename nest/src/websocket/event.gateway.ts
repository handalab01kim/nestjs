import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { HistoryDto } from '../history/history.dto';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Inject } from '@nestjs/common';
import { HistoryService } from 'src/history/history.service';

@WebSocketGateway({ cors: true })
// @WebSocketGateway({ namespace: 'room', cors: true }) // 네임스페이스 설정
// @WebSocketGateway({
//   cors: {
//     origin: '*', // 실제 배포 시에는 보안을 위해 특정 도메인으로 제한
//   },
// })
export class eventGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @Inject()
  private readonly historyService: HistoryService;

  @WebSocketServer()
  server: Server; // 전체 네임스페이스 서버

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  } // 인터페이스 구현

  @SubscribeMessage('event') // 이벤트 설정
  async handleMessage(
    // @MessageBody() msg: { sender: string; message: string },
    @MessageBody() msg: HistoryDto,     // api에서는 @Body() createUserDto: CreateUserDto (import { Body, Controller, Post } from '@nestjs/common';)
    @ConnectedSocket() client: Socket,
  ) {
    const parsedMsg = msgParser(msg);
    // console.log(`[${parsedMsg.sender}]: ${parsedMsg.message}`);

    // --- validation --- //
    const dto = plainToInstance(HistoryDto, parsedMsg);

    const errors = validateSync(dto);

    if (errors.length > 0) {
      console.log("Websocket - Validation failed: " + JSON.stringify(errors));
      return;
    }

    // 유효하면 service 호출
    await this.historyService.createHistory(dto);

    // client.broadcast.emit('message', data); // 다른 클라이언트에게 전파
    this.server.emit('event', parsedMsg); // 다른 클라이언트에게 전파
    return { received: true };
  }
}

function msgParser(msg:any){
    let parsedMsg;
    
    if(typeof msg === "string"){
      try{ // text 타입으로 받았을 경우
        parsedMsg = JSON.parse(msg);
      } catch (e){
        console.log(e);
        return; 
      }
    } else{ // json 타입으로 받았을 경우
        parsedMsg = msg;
    }
    return parsedMsg
}