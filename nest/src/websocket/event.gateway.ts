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
import { historyDto } from '../history/history.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common'; // websocket body 유효성 검사

@WebSocketGateway({ cors: true })
// @WebSocketGateway({ namespace: 'room', cors: true }) // 네임스페이스 설정
// @WebSocketGateway({
//   cors: {
//     origin: '*', // 실제 배포 시에는 보안을 위해 특정 도메인으로 제한
//   },
// })
export class eventGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server; // 전체 네임스페이스 서버

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  } // 인터페이스 구현

  @SubscribeMessage('event') // 이벤트 설정
  // @UsePipes(new ValidationPipe({ 
  //   whitelist: true, 
  //   forbidNonWhitelisted: true,
  //   transform: true, // string → number 등 타입 자동 변환
  // })) // 유효성 검사 (api는 자동?)
  // -> 안됨 !!!
  handleMessage(
    // @MessageBody() msg: { sender: string; message: string },
    @MessageBody() msg: historyDto,     // api에서는 @Body() createUserDto: CreateUserDto (import { Body, Controller, Post } from '@nestjs/common';)
    @ConnectedSocket() client: Socket,
  ) {
    const parsedMsg = msgParser(msg);
    // console.log(`[${parsedMsg.sender}]: ${parsedMsg.message}`);

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