import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/:test")
  test(@Param('test') test: number): number {
    const a:number = test;
    console.log("TEST", a*2);
    return a*2;
  }
}
