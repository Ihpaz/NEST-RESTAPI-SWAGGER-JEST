import { Controller, Post, Body, Get } from '@nestjs/common';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WaDto } from './dto/wa.dto';

@ApiTags('whatsapp')
@Controller('Api/v1/whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @ApiOperation({
    summary:'Create Pesan'
  })
  @Post('send-message')
  async sendMessage(@Body() payload: WaDto) {
    const { number, message } = payload;
    await this.whatsappService.sendMessage(number, message);
    return { success: true };
  }

  @Get()
  async InitWa(){
    await this.whatsappService.initWa()
    return true
  }
}
