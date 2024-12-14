const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
console.log(windowWidth, windowHeight);
var game = new Phaser.Game(windowHeight, windowWidth, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    update: update
});

function preload() {
    game.load.spritesheet('raphael', 'assets/Ninja_Frog/player4.png', 48, 30, 12);
    game.load.image('wall', 'assets/Terrain/wall.png');
    game.load.image('enemy', 'assets/Chicken/chickenrun.png');
    game.load.image('fruit', 'assets/Fruits/Pineapple.png');
}

var cursors;
var sprite;
var walls;
var fruits;
var enemies;
var score = 0;
var scoreText;

function create() {
    game.stage.backgroundColor = "#3598db";
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.enableBody = true;

    cursors = game.input.keyboard.createCursorKeys();

    sprite = game.add.sprite(70, 100, 'raphael');
    sprite.animations.add('walk');
    sprite.animations.play('walk', 13, true);
    sprite.body.gravity.y = 300;

    walls = game.add.group();
    walls.enableBody = true;

    fruits = game.add.group();
    fruits.enableBody = true;

    enemies = game.add.group();
    enemies.enableBody = true;

    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    var level = [
        '                                     ',
        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'x                         !       o x',
        'x     o                             x',
        'x                         xxxx      x',
        'x                o                  x',
        'x                    xxx            x',
        'x              xx                !  x',
        'x                                   x',
        '                                    x',
        '          o                  o      x',
        'x     xxxxxxxxx        xxxxxxxxxx   x',
        '           !                        x',
        '                     o              x',
        'xxxxxxxxxxxxxxxx     xxxxxxxxxxxxxxxx'
    ];

    for (var i = 0; i < level.length; i++) {
        for (var j = 0; j < level[i].length; j++) {
            if (level[i][j] == 'x') {
                var wall = walls.create(30 + 20 * j, 30 + 20 * i, 'wall');
                wall.body.immovable = true;
            } else if (level[i][j] == 'o') {
                var fruit = fruits.create(30 + 20 * j, 30 + 20 * i, 'fruit');
            } else if (level[i][j] == '!') {
                var enemy = enemies.create(30 + 20 * j, 30 + 20 * i, 'enemy');
            }
        }
    }
}

function update() {
    game.physics.arcade.collide(sprite, walls);
    game.physics.arcade.overlap(sprite, fruits, takeFruit, null, this);
    game.physics.arcade.overlap(sprite, enemies, restart, null, this);

    sprite.body.velocity.x = 0;

    if (cursors.left.isDown) {
        sprite.body.velocity.x = -200;
    } else if (cursors.right.isDown) {
        sprite.body.velocity.x = 200;
    }

    if (cursors.up.isDown && sprite.body.touching.down) {
        sprite.body.velocity.y = -250;
    }
}

function takeFruit(sprite, fruit) {
    fruit.kill();
    score += 10;
    scoreText.text = 'Score: ' + score;
}

function restart() {
    score = 0;
    game.state.start(game.state.current);
}
