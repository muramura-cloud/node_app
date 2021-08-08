import { IncomingMessage, ServerResponse } from 'http';
import fs from "fs";
const url = require('url');
const ejs = require('ejs');
const qs = require('querystring');

const index_page = fs.readFileSync('./index.ejs', 'UTF-8');
const other_page = fs.readFileSync('./other.ejs', 'UTF-8');
const style = fs.readFileSync('./style.css', 'UTF-8');

var data = { msg: 'no message...' };

export function getFromClient(request: IncomingMessage, response: ServerResponse) {
    const url_parts = url.parse(request.url, true);

    console.log(url_parts);

    switch (url_parts.pathname) {
        case '/':
            response_index(request, response);
            break;

        case '/other.ejs':
            response_other(request, response);
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

function response_index(request: IncomingMessage, response: ServerResponse) {
    let msg = 'これはIndexのページです。';

    if (request.method === "POST") {
        let body = '';
        request.on('data', (data) => {
            body += data;
        });

        request.on('end', () => {
            data = qs.parse(body);
            write_index(request, response);
        });
    } else {
        write_index(request, response);
    }
}

function response_other(request: IncomingMessage, response: ServerResponse) {
    let msg = 'これはOtherのページです。';

    if (request.method == "POST") {
        let body = '';
        request.on('data', (data) => {
            body += data;
        });

        request.on('end', () => {
            let post_data = qs.parse(body);
            msg += 'あなたは' + post_data.msg + 'と送信しました。';
            let content = ejs.render(other_page, {
                title: 'other',
                content: msg
            });
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write(content);
            response.end();
        });
    } else {
        let msg = 'メッセージがありません。';
        let content = ejs.render(other_page, {
            title: 'other',
            content: msg
        });
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(content);
        response.end();
    }

}

function write_index(request: IncomingMessage, response: ServerResponse) {
    let msg = '伝言を表示します。';
    let content = ejs.render(index_page, {
        filename: './index.ejs',
        title: 'index',
        content: msg,
        data: data,
    });
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(content);
    response.end();
}
