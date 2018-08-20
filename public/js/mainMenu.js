var Bomberman = Bomberman || {}
var mainMenuMusic;

Bomberman.MainMenu = function () { };

Bomberman.MainMenu.prototype = {
    init: function () {
        
    },
    create: function () {
        
        mainMenuMusic = this.game.add.audio('mainMenu');
        mainMenuMusic.loop = true;
        mainMenuMusic.play();

        var text = "THE PHASER BOMBERMAN";
        var style = { font: "30px Arial", fill: "#fff", align: "center" };
        var t = this.game.add.text(this.game.width / 2, 100, text, style);
        t.anchor.set(0.5);
        
        var text = "Click to play";
        var style = { font: "30px Arial", fill: "#fff", align: "center" };
        var t = this.game.add.text(this.game.width / 2, this.game.height / 2, text, style);
        t.anchor.set(0.5);
        
        var text = "Keyboard ARROWS to move and SPACEBAR to release the bomb";
        var style = { font: "15px Arial", fill: "#fff", align: "center" };
        var t = this.game.add.text(this.game.width / 2, this.game.height -100, text, style);
        t.anchor.set(0.5);

    },
    update: function () {
        if (this.game.input.activePointer.justPressed()) {
            mainMenuMusic.stop();
            this.game.state.start('Game');
        }
    }
};
