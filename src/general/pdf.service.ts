import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import { join } from 'path';
import * as fs from 'fs';
import { Config } from '../helpers/config.helper';

@Injectable()
export class PdfService {

    constructor(
    ) { }



    async generatePDFNew(dir: string, data: any = {}, options: any = {}) {
        try {
            let path = '';
            if (Config.get('APP_MODE') === 'prod') {
                path = join(process.cwd(), 'view', 'pdf', dir, 'html.hbs');
            } else {
                path = join(process.cwd(), 'dist', 'view', 'pdf', dir, 'html.hbs');
            }
            const templateHtml = fs.readFileSync(path, 'utf8');
            const template = handlebars.compile(templateHtml);
            const html = template(data);

            // const browser = await puppeteer.launch({
            //     args: ['--no-sandbox'],
            //     headless: true
            // });
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto(`data:text/html;charset=UTF-8,${encodeURIComponent(html)}`, {
                waitUntil: 'networkidle0'
            });

            const pdf = await page.pdf(options);
            await browser.close();

            return pdf;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
