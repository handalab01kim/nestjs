const Stream = require("node-rtsp-stream") as any;
import { Injectable } from "@nestjs/common";
// import config from "../config/config";
import { exec } from "child_process";

// 해상도 점검 func
function getStreamResolution(rtspUrl: string): Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
        const cmd = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "${rtspUrl}"`;
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(`ffprobe error: ${stderr}`);
                return;
            }
            const [width, height] = stdout.trim().split(',').map(Number);
            if (isNaN(width) || isNaN(height)) {
                reject("Unable to parse resolution");
            } else {
                resolve({ width, height });
            }
        });
    });
}

// RtspStream 객체
@Injectable()
export class RtspService{
    url:string;
    // name:string;
    stream:any;
    port:number;
    lastData:any;
    intervalId:any;
    isConnected:boolean;
    isReloading: boolean;
    
    constructor(){
        this.url = process.env.RTSP_URL ?? 'no-rtsp-url!!';
        // this.name = name;
        this.stream = null;
        this.port = +(process.env.RTSP_PORT ?? -1);
        this.lastData = new Date();
        this.intervalId = 0;
        this.isConnected=false;
        this.isReloading = false;
    
        this.startInterval(); // 객체 생성 시 자동 시작
    }

    startInterval():void{
        this.startStream();

        var timer = setInterval(()=>{
                this.intervalId = timer;
                var today = new Date();
                if (this.lastData !== undefined) { // rtsp stream 정상 작동하지 않음
                    var stream_data = new Date(this.lastData);
                    var emptyTime = (today.getTime() - stream_data.getTime()) / 1000; // 1초
                    if (emptyTime >= 10) { // 10초
                        this.reload(); 
                        this.lastData = new Date();
                    }
                }
            },
            1000
        );  
    }
    reload():void{
        if(this.isReloading) return; // 중복 호출 방지
        this.isReloading = true;
        try{
            this.stream?.stop(); // 중지 // 소켓 서버 close
            setTimeout(()=>{
                this.startStream().finally(() => {
                    this.isReloading = false;
                });
            }, 1000);
        } catch(e){ // this.stream===null
            this.isReloading = false;
        }
    }

    async startStream():Promise<void>{
        try{
            const { width, height } = await getStreamResolution(this.url); // 시간 issue

            if(width==0 || height==0){throw new Error("width==0 || height==0");}
            if(this.isConnected){throw new Error("isConnected===true");}
            // const width = 640;
            // const height = 480;
            console.log(`### RTSP-Streaming-Starting: {\n\trtsp-url: ${this.url},\n\tport:${this.port}\n\tResolution: [${width}, ${height}]\n}`);
            const stream:any = new Stream({
                // name: this.name,
                streamUrl: this.url,
                wsPort: this.port,
                width: width,
                height: height,
            });
            this.stream = stream;
        
            stream.mpeg1Muxer.on('ffmpegStderr', (data:any) => {
                this.lastData = new Date();
            });
            this.isConnected = true;
        } catch (e) {
            if(this.isConnected){
                console.error("rtsp streaming failed:", `${this.url}, ${this.port}, ${e}`);
                // systemlogService.recordSystemLog("BE Server", `${this.url}, ${this.port}, 재시작 실패: ${e}`);
            }
            this.isConnected = false;
        }
    }
    // setUrl(url:string):void{
    //     this.lastData=new Date();
    //     this.url = url;
    //     this.reload();
    //     // systemlogService.recordSystemLog("BE Server", `RTSP URL 변경, 웹소켓 서버 재시작; ${this.url}, ${this.port}`);
    // }
}
