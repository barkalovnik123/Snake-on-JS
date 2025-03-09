'use strict';

const scene = document.getElementById("scene"), //dom таблица-сцена
      sceneHeight = 21,                         //высота сцены
      sceneWidth = 50,                          //ширина сцены
      emptyColor= 'lime',                       //цвет пустой клетки
      headColor = 'blue',                       //цвет головы змейки
      tailColor = 'blue',                       //цвет хвоста змейки
      appleColor= 'red',                        //цвет яблока
      step      = 75;                          //задержка между шагов змейки (мс)

for (let y=0;y<sceneHeight;y++) { //создаём поле
    const row = document.createElement('tr');

    for (let x=0;x<sceneWidth;x++) {
        const cell = document.createElement('td');
        cell.setAttribute('y', y);
        cell.setAttribute('x', x);
        const size = `${document.documentElement.clientWidth/sceneWidth}px`;
        cell.style.width = size; cell.style.height = size; cell.style.backgroundColor = emptyColor;
        row.append(cell);
    }

    scene.append(row);
}

const r = a => Math.floor(Math.random() * a); //удобная функция, дающая псевдорандом в [0; a]

function findCell(x, y) {   //функция для нахождения клетки по координатам, где (0,0) - верхнее лево
    return document.querySelector(`[x='${x}'][y='${y}']`)
}

function paint(x, y, c) {   //покрасить клеточку (x,y) в цвет c
    const cell = findCell(x, y);
    cell.style.backgroundColor = c;
}

function end() {    //gameover
    scene.innerHTML = '';
}

class Head {    //класс головы
    size = 1;                   //размер хвоста
    constructor(x, y) {         //при создании
        paint(x, y, headColor); //красим клетку на поле

        this.x = x; this.y = y; //сохраняем нач. положение

        new Apple(r(sceneWidth), r(sceneHeight));   //создаём яблочк
    }
    move(d) { /*двинуться в направлении d*/
        try { //если вышли за границы сетки, то возникнет ошибка
            paint(this.x, this.y, 'red');

            for (let i = 0; i < this.size; i++) {
                new Tail(this.x, this.y, this.size);
            };

            switch (d) {
                case 'up':
                    this.y -= 1; break;
                case 'down':
                    this.y += 1; break;
                case 'left':
                    this.x -= 1; break;
                case 'right':
                    this.x += 1; break;
            }

            paint(this.x, this.y, 'blue');

            const cell = findCell(this.x, this.y);

            if (cell.getAttribute('hasTail') == '1') {
                end()
            }

            if (cell.getAttribute('hasApple')== '1') {
                this.size += 1;
                spawnApple();
                cell.setAttribute('hasApple', '0');
            }
        } catch {
            end()
        }

        function spawnApple() {
            let x, y;
            do {x = r(sceneWidth); y = r(sceneHeight)} while (findCell(x, y).getAttribute('hasTail') == '1');
            new Apple(x, y);
        }
    }
}

class Tail {
    constructor(x, y, size) {
        this.x = x, this.y = y, this.size = size;

        const cell = findCell(this.x, this.y);

        paint(this.x, this.y, tailColor);

        const dieTimer = setTimeout(()=>{
            paint(this.x, this.y, emptyColor);
            cell.setAttribute("hasTail", '0');
        }, step * this.size);

        cell.setAttribute("hasTail", '1');
    }
}

class Apple {
    constructor(x, y) {
        this.x = x; this.y = y;
        
        paint(x, y, appleColor);

        const cell = findCell(x, y);
        cell.setAttribute('hasApple', '1');
    }
}

const head = new Head(4, 4);

let dir = 'right';

const interval = setInterval(()=>{
    head.move(dir);
}, step);

let last_move;

document.addEventListener('keydown', event => {
    const keys = {'KeyW': "up",  'KeyD': 'right', 'KeyS': 'down', 'KeyA': 'left',
    'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right'};
    
    const opposites = {"up": "down", "down": "up", "right": "left", "left": "right"};

    if (last_move != opposites[keys[event.code]]) {
        last_move = keys[event.code]; dir = keys[event.code];
    }
});