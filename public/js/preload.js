var Bomberman = Bomberman || {}

Bomberman.Preload = function () { };

Bomberman.Preload.prototype = {
    preload: function () {
        //this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        //this.splash.anchor.setTo(0.5);
        
        //this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
        //this.preloadBar.anchor.setTo(0.5);
        
        //this.load.setPreloadSprite(this.preloadBar);
        
        this.load.tilemap('map', '../assets/arena2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', '../assets/gridtiles.png');
        this.load.image('startButton', '../assets/startButton.png');
        this.load.spritesheet('player', '../assets/playerSpritesheet.png', 32, 32);
        this.load.spritesheet('bomb', '../assets/bomb.png', 16, 16);
        this.load.spritesheet('enemy', '../assets/hEnemy.png', 32, 32);
        this.load.spritesheet('bombExplosion', '../assets/bombExplosion1.png', 32, 32);
        this.load.audio('explosionSound', '../assets/explosion.wav');
        this.load.audio('levelMusic', '../assets/battle-theme.mp3');
        this.load.audio('gameover', '../assets/gameover.mp3');
        this.load.audio('mainMenu', '../assets/title.mp3');
        this.load.audio('victory', '../assets/level-clear.mp3');
        
    },
    create: function () {
        this.state.start('MainMenu');
    }
};
