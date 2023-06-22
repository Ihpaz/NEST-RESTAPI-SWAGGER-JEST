import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { Client, LegacySessionAuth, LocalAuth, Message } from 'whatsapp-web.js';
const fs = require('fs');
const qrcode = require('qrcode-terminal');

@Injectable()
export class WhatsappService {
  private client: Client;

  constructor() {
    
  }


  async initWa(){
    const SESSION_FILE_PATH = join(__dirname, `session.json`);

    // Load the session data if it has been previously saved
    let sessionData;
    if(fs.existsSync(SESSION_FILE_PATH)) {
        sessionData = import(SESSION_FILE_PATH);
    }

    // Use the saved values
    this.client = new Client({
        restartOnAuthFail: true,
        puppeteer: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one doesn't works in Windows
            '--disable-gpu'
          ],
        },
        authStrategy: new LocalAuth()
      });

    this.client.on('qr', (qr) => {
        // Generate and scan this code with your phone
        qrcode.generate(qr, { small: true });
        // console.log('QR RECEIVED', qr);
    });
    
    this.client.on('ready', () => {
        console.log('Client is ready!');
    });

    // Save session values to the file upon successful auth
  

   await this.client.initialize();
  }
  async sendMessage(number: string, message: string): Promise<void> {
 
    if(!this.client) await this.initWa();
    const chat = await this.client.getChatById(number);
    await chat.sendMessage(message);
  }
}
