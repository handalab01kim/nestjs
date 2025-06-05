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
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@WebSocketGateway({ cors: true })
// @WebSocketGateway({ namespace: 'room', cors: true }) // 네임스페이스 설정
// @WebSocketGateway({
//   cors: {
//     origin: '*', // 실제 배포 시에는 보안을 위해 특정 도메인으로 제한
//   },
// })
export class eventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly httpService: HttpService) {}

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
    @MessageBody() msg: historyDto,     // api에서는 @Body() createUserDto: CreateUserDto (import { Body, Controller, Post } from '@nestjs/common';)
    @ConnectedSocket() client: Socket,
  ) {
    const parsedMsg = msgParser(msg);
    // console.log(`[${parsedMsg.sender}]: ${parsedMsg.message}`);


    try{
      await firstValueFrom(
        this.httpService.post(`http://localhost:${process.env.PORT ?? 3000}/api/history`, msg,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

    }catch(e){
      console.log("Websocket - Invalid type: ", e.response?.data);
      // console.log("Websocket - Invalid type: ", e.message);
      return;
    }

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