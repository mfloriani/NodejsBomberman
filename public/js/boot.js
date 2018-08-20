var Bomberman = Bomberman || {}

Bomberman.Boot = function () { };

Bomberman.Boot.prototype = {
    preload: function () {
        
    },
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.state.start('Preload');
    }
};
