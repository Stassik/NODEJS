const express = require('express');
const fs = require('fs');
const handlebars = require('handlebars');
const validate = require('./validation.js');

const { join } = require('path');

const app = express();
app.use(express.json());


const pathDb = join(__dirname, './users.json');
let unicId = 0;


app.get('/users-list', (req, res) => {
    const users = JSON.parse(fs.readFileSync(pathDb));
    const template = handlebars.compile(
        '{{#each users}}<li class="users__item"><h3>{{this.firstName}} {{this.lastName}}</h3><span>ID: {{this.id}}</span><p><span>Возраст: {{this.age}} </span><span>Город: {{this.city}}</span></p></li>{{/each}}')
    res.send(`<h1>Список пользователей</h1><ul class="users__list">${template({ users })}</ul>`);
});

app.get('/users-list/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync(pathDb));
    const user = users.find((user) => user.id === Number(req.params.id));
    if (user) {
        res.send(`<h1>Страница пользователя</h1><h3>${user.firstName} ${user.lastName}</h3><span>ID: ${user.id}</span><p><span>Возраст: ${user.age} </span><span>Город: ${user.city}</span></p>`);
    } else {
        res.status(400);
        res.send('<h1>Пользователь не найден</h1>');
    }

});

app.post('/users-list', (req, res) => {
    validate(req, res);
    const users = JSON.parse(fs.readFileSync(pathDb));
    if (users.length > 0) {
        unicId = users[users.length - 1].id + 1;
    } else {
        unicId = 1;
    }

    users.push({
        id: unicId,
        ...req.body,
    });
    fs.writeFileSync(pathDb, JSON.stringify(users, null, 2));
    res.send('Был создан новый пользователь');


});

app.put('/users-list/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync(pathDb));
    let user = users.find((user) => user.id === Number(req.params.id));
    if (user) {
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.age = req.body.age;
        user.city = req.body.city;

        fs.writeFileSync(pathDb, JSON.stringify(users, null, 2));
        res.send(`<h1>Пользователь с ID: ${user.id} был изменен</h1>`);
    } else {
        res.status(400);
        res.send('<h1>Пользователь не найден</h1>');
    }

});

app.delete('/users-list/:id', (req, res) => {
    const users = JSON.parse(fs.readFileSync(pathDb));
    let user = users.find((user) => user.id === Number(req.params.id));
    if (user) {
        const userIndex = users.indexOf(user);
        users.splice(userIndex, 1);

        fs.writeFileSync(pathDb, JSON.stringify(users, null, 2));
        res.send(`<h1>Пользователь с ID: ${user.id} был удален</h1>`);
    } else {
        res.status(400);
        res.send('<h1>Пользователь не найден</h1>');
    }

});


app.listen(3000);
