import { IncomingMessage, ServerResponse } from 'http';
import fs from "fs";
const url = require('url');
const ejs = require('ejs');
const qs = require('querystring');

const index_page = fs.readFileSync('./index.ejs', 'UTF-8');
const login_page = fs.readFileSync('./login.ejs', 'UTF-8');
const style = fs.readFileSync('./style.css', 'UTF-8');

const max_num = 10;
const filename = 'mydata.txt';
// どこからでも参照可能（グローバル変数）
var message_data: string[];
readFromFile(filename);

export function getFromClient(request: IncomingMessage, response: ServerResponse) {
    const url_parts = url.parse(request.url, true);

    console.log(url_parts);

    switch (url_parts.pathname) {
        case '/':
            response_index(request, response);
            break;

        case '/login.ejs':
            response_login(request, response);
            break;

        default:
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end('no page...');
            response.end();
    }
}

function response_index(request: IncomingMessage, response: ServerResponse) {
    if (request.method === "POST") {
        let body = '';
        request.on('data', (data) => {
            body += data;
        });

        request.on('end', () => {
            let data = qs.parse(body);
            addToData(data.id, data.msg, filename, request);
            write_index(request, response);
        });
    } else {
        write_index(request, response);
    }
}

function response_login(request: IncomingMessage, response: ServerResponse) {
    let content = ejs.render(login_page, {});
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(content);
    response.end();
}


function write_index(request: IncomingMessage, response: ServerResponse) {
    let msg = '何かメッセージを書いてください。';
    let content = ejs.render(index_page, {
        filename: './index.ejs',
        title: 'index',
        content: msg,
        data: message_data,
    });
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(content);
    response.end();
}

function setCookie(key: string, value: string, response: ServerResponse) {
    let cookie = escape(value);
    response.setHeader('Set-Cookie', [key + '=' + cookie]);
}

function getCookie(key: string, request: IncomingMessage) {
    let cookie_data = request.headers.cookie != undefined ? request.headers.cookie : '';
    let data = cookie_data.split(';');
    for (let i in data) {
        if (data[i].trim().startsWith(key + '=')) {
            let result = data[i].trim().substring(key.length + 1);
            return unescape(result);
        }
    }

    return '';
}

function readFromFile(fname: string) {
    fs.readFile(fname, 'UTF-8', (err, data) => {
        message_data = data.split('\n');
    });
}

function addToData(id: number, msg: string, fname: string, req: IncomingMessage) {
    let obj = { 'id': id, 'msg': msg };
    let obj_str = JSON.stringify(obj);
    console.log('add data: ' + obj_str);
    message_data.unshift(obj_str);
    if (message_data.length > max_num) {
        message_data.pop();
    }
    savaToFile(fname);
}

function savaToFile(fname: string) {
    let data_str = message_data.join('\n');
    fs.writeFile(fname, data_str, (err) => {
        if (err) {
            throw err;
        }
    });
}
