import { IncomingMessage, ServerResponse } from 'http';
import fs from "fs";
const url = require('url');
const ejs = require('ejs');

const index_page = fs.readFileSync('./index.ejs', 'UTF-8');
const other_page = fs.readFileSync('./other.ejs', 'UTF-8');
const style = fs.readFileSync('./style.css', 'UTF-8');

export function getFromClient(request: IncomingMessage, response: ServerResponse) {
    var url_parts = url.parse(request.url, true);

    console.log(url_parts);

    switch (url_parts.pathname) {
        case '/':
            let content = 'これはIndexのpageです。';
            if (url_parts.query != undefined) {
                content += 'あなたは' + url_parts.query.msg + 'と送りました。';
            }
            var write_content = ejs.render(index_page, {
                title: 'Index',
                content: content
            });
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(write_content);
            response.end();
            break;

        case '/other.ejs':
            // let content = ejs.render(other_page, {
            //     title: 'Other',
            //     content: 'これはEJSを使ったページです。'
            // });
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write('no page');
            response.end();
            break;

        case '/style.css':
            response.writeHead(200, { 'Content-Type': 'text/css' });
            response.write(style);
            response.end();
            break;

        default:
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end('no page...');
            response.end();
    }
}
