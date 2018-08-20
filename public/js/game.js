var Bomberman = Bomberman || {}

var map;
var layer;
var player;
var cursor;
var playerVel = 100;
var bomb;
var bombReady = true;
var vLine;
var hLine;
var enemies;
var explosions;
var explosionSound;
var levelMusic;
var sounds;
var playerDying;
var score;
var lives;
var scoreText;
var livesText;
var GAMEOVER = 1;
var VICTORY = 2;

Bomberman.Game = function () { };

Bomberman.Game.prototype = {
    create: function () {
        
        levelMusic = this.game.add.audio('levelMusic');
        explosionSound = this.game.add.audio('explosionSound');
        
        levelMusic.loop = true;
        levelMusic.play();

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        map = this.game.add.tilemap('map');
        map.addTilesetImage('gridtiles', 'tiles');
        map.setCollisionBetween(1, 28);
        
        layer = map.createLayer('layer1');
        layer.resizeWorld();
        
        explosions = this.game.add.group();
        explosions.enableBody = true;
        
        enemies = this.game.add.group();
        enemies.enableBody = true;
        
        map.createFromObjects('objects1', 'hEnemy', 'enemy', 0, true, false, enemies);
        enemies.callAll('animations.add', 'animations', 'walk', [0, 1, 2], 5, true);
        enemies.callAll('animations.play', 'animations', 'walk');
        
        enemies.forEach(function (e) {
            e.body.velocity.x = -30;
            e.body.setSize(24, 22, 4, 4);
            e.body.bounce.x = 1;
        }, this);
        
        playerHead = this.game.add.sprite(32, 32, 'player');
        playerHead.x = 0;
        playerHead.y = 0;
        playerHead.animations.add('idleHead', [122], 60, true);
        playerHead.animations.play('idleHead');
        
        score = 0;
        scoreLabelText = this.game.add.text(450, 6, 'Score: ', { font: '18px Arial', fill: '#ffffff' });
        scoreText = this.game.add.text(520, 6, score, { font: '18px Arial', fill: '#ffffff', align: 'right' });
        
        lives = 3;
        livesLabelText = this.game.add.text(35, 6, ' X ', { font: '18px Arial', fill: '#ffffff' });
        livesText = this.game.add.text(60, 6, lives, { font: '18px Arial', fill: '#ffffff' });
        
        
        player = this.game.add.sprite(32, 32, 'player');
        player.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(player);
        this.respawnPlayer();
        player.body.gravity.y = 0;
        player.body.setSize(24, 23, 4, 5);
        
        player.animations.add('up', [0, 1, 2], 10, true);
        player.animations.add('right', [9, 10, 11], 10, true);
        player.animations.add('down', [18, 19, 20], 10, true);
        player.animations.add('idle', [18], 60, true);
        player.animations.add('left', [27, 28, 29], 10, true);
        player.animations.add('dying', [63, 64, 65, 66], 10, true);
        
        cursor = this.game.input.keyboard.createCursorKeys();
        spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        
        sounds = [levelMusic, explosionSound];
        this.game.sound.setDecodedCallback(sounds, this.start, this);
    },
    update: function () {
        
        this.game.physics.arcade.collide(player, layer);
        this.game.physics.arcade.collide(player, bomb);
        this.game.physics.arcade.overlap(player, explosions, this.killPlayer, null, this);
        this.game.physics.arcade.overlap(player, enemies, this.killPlayer, null, this);
        this.game.physics.arcade.collide(enemies, layer);
        this.game.physics.arcade.collide(enemies, bomb);
        this.game.physics.arcade.overlap(enemies, explosions, this.killEnemy, null, this);
        
        if (playerDying) {
            player.animations.play('dying');
        }
        else if (cursor.left.isDown) {
            player.body.velocity.x = -playerVel;
            player.animations.play('left');
        }            
        else if (cursor.right.isDown) {
            player.body.velocity.x = playerVel;
            player.animations.play('right');
        }            
        else if (cursor.up.isDown) {
            player.body.velocity.y = -playerVel;
            player.animations.play('up');
        }
        else if (cursor.down.isDown) {
            player.body.velocity.y = playerVel;
            player.animations.play('down');
        }
        else {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            player.animations.play('idle');
        }
        
        if (spaceKey.isDown && bombReady) {
            this.createBomb();
        }
            
            
    },
    start: function () {
        
    },
    render: function () {
            //this.game.debug.text('Tile X: ' + layer.getTileX(player.x), 0, 15, 'rgb(255,255,255)');
            //this.game.debug.text('Tile Y: ' + layer.getTileY(player.y), 100, 15, 'rgb(255,255,255)');

            //this.game.debug.bodyInfo(player, 32, 80);
            //this.game.debug.spriteBounds(player);
            //this.game.debug.cameraInfo(this.game.camera, 32, 80);
            //this.game.debug.body(player);
            //this.game.debug.geom(vLine);
            //this.game.debug.geom(hLine);

    },
    createBomb: function () {
        bombReady = false;
        bomb = this.game.add.sprite(player.x, player.y, 'bomb');
        bomb.anchor.setTo(0.5, 0.5);
        bomb.animations.add('bomb', [0, 1, 2, 3], 10, true);
        bomb.animations.play('bomb');
        this.game.time.events.add(Phaser.Timer.SECOND * 3, this.explodeBomb, this);
        this.game.physics.arcade.enable(bomb);
        bomb.body.immovable = true;
    },
    explodeBomb: function () {
        
        explosionSound.play();
        vLine = new Phaser.Line();
        vLine.start.set(bomb.x, bomb.y - 32);
        vLine.end.set(bomb.x, bomb.y + 32);
        vTileHits = layer.getRayCastTiles(vLine, 1, false, false);
        
        for (var i = 0; i < vTileHits.length; i++) {
            if (vTileHits[i].index == 71 || vTileHits[i].index == 9) {
                var explosion = this.game.add.sprite(vTileHits[i].x * 32, vTileHits[i].y * 32, 'bombExplosion');
                explosion.events.onAddedToGroup.add(this.killExplosion, this);
                explosions.add(explosion);
                this.game.add.tween(explosion).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);

            }
            this.destroyTile(vTileHits[i].index, vTileHits[i].x, vTileHits[i].y);
        }
                
        hLine = new Phaser.Line();
        hLine.start.set(bomb.x - 32, bomb.y);
        hLine.end.set(bomb.x + 32, bomb.y);
        hTileHits = layer.getRayCastTiles(hLine, 1, false, false);
        for (var i = 0; i < hTileHits.length; i++) {
            if (hTileHits[i].index == 71 || hTileHits[i].index == 9) {
                var explosion = this.game.add.sprite(hTileHits[i].x * 32, hTileHits[i].y * 32, 'bombExplosion');
                explosion.events.onAddedToGroup.add(this.killExplosion, this);
                explosions.add(explosion);
                this.game.add.tween(explosion).to({ alpha: 0 }, 900, Phaser.Easing.Linear.None, true);
            }
            this.destroyTile(hTileHits[i].index, hTileHits[i].x, hTileHits[i].y);
        }
        
        layer.dirty = true;
        bomb.kill();
        bombReady = true;
    },
    killExplosion : function (sprite) {
        this.game.time.events.add(800, function () {
            sprite.kill();
        }, this);
    },
    destroyTile: function (index, x, y) {
        if (index == 9) {           // destructible
            map.putTile(71, x, y);  //replace with the grass (71)
            this.scorePoints(10);
        }
    },
    killEnemy: function (enemy) {
        enemy.kill();
        enemies.remove(enemy);
        console.log(enemies.length);
        this.scorePoints(100);
        if (enemies.length <= 0) {
            levelMusic.stop();
            this.addNewScore();
            this.game.state.start('HighScore', true, false, VICTORY);
        }
    },
    killPlayer: function () {
        playerDying = true;
        livesText.text = lives--;
        if (lives <= 0) {
            this.addNewScore();
            levelMusic.stop();
            this.game.state.start('HighScore', true, false, GAMEOVER);
        }
        else {
            this.game.time.events.add(400, function () {
                this.respawnPlayer();
            }, this);
        }
    },
    scorePoints: function (points) {
        score += points;
        scoreText.text = score;
    },
    respawnPlayer: function () {
        playerDying = false;
        player.x = 48;
        player.y = 80;
        bombReady = true;
    },
    addNewScore: function (){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/addNewScore/' + parseInt(score), true);
        xhr.send();
    }
}
