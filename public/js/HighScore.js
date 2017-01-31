var Bomberman = Bomberman || {}
var gameoverMusic;
var victoryMusic;
var behavior;
var GAMEOVER = 1;
var VICTORY = 2;

Bomberman.HighScore = function () { };

Bomberman.HighScore.prototype = {
    init: function (param) {
        behavior = param;
    },
    create: function () {
        
        this.getTopTenScores(this.showScores, this.game);

        if (behavior == GAMEOVER) {
            gameoverMusic = this.game.add.audio('gameover');
            gameoverMusic.play();
            
            var text = "GAMEOVER";
            var style = { font: "30px Arial", fill: "#fff", align: "center" };
            var t = this.game.add.text(this.game.width / 2, 100, text, style);
            t.anchor.set(0.5);
        }
        else if(behavior == VICTORY) {
            victoryMusic = this.game.add.audio('victory');
            victoryMusic.play();
            
            var text = "PARABÉNS!!! Você conseguiu.";
            var style = { font: "30px Arial", fill: "#fff", align: "center" };
            var t = this.game.add.text(this.game.width / 2, 100, text, style);
            t.anchor.set(0.5);
        }
        
        var text = "Clique para jogar novamente";
        var style = { font: "30px Arial", fill: "#fff", align: "center" };
        var t = this.game.add.text(this.game.width / 2, this.game.height - 70, text, style);
        t.anchor.set(0.5);
        
        
    },
    update: function () {
        if (this.game.input.activePointer.justPressed()) {
            if (behavior == GAMEOVER) {
                gameoverMusic.stop();
            }
            else if (behavior == VICTORY) {
                victoryMusic.stop();
            }
            this.game.state.start('Game');
        }
    },
    showScores: function (score, objGame) {
        //console.log('showScores ' + score);
        
        var h = 170;
        //objGame.debug.text('10 MAIORES PONTUAÇÕES', 0, h, 'rgb(255,255,255)');
        
        var text = "10 MAIORES PONTUAÇÕES";
        var style = { font: "20px Arial", fill: "#fff", align: "center" };
        var t = objGame.add.text(objGame.width / 2, h, text, style);
        t.anchor.set(0.5);
        
        var response = {};
        try {
            //console.log('try parse');
            //console.log(this.responseText);
            response = JSON.parse(score);
            //console.log(response);
        } 
        catch (e) { }
        
        h += 20;
        response.forEach(function (e) {
            h += 20;
            //console.log(e.pontos);
            //objGame.debug.text( e.pontos, 0, h, 'rgb(255,255,255)');
            var text = e.pontos;
            var style = { font: "15px Arial", fill: "#fff", align: "center" };
            var t = objGame.add.text(objGame.width / 2, h, text, style);
            t.anchor.set(0.5);
        }, this);

    },
    getTopTenScores: function (callback, objGame) {
        //console.log('getTopTenScores');
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/getTopTen', true);
        xhr.onreadystatechange = function () {
            //console.log('onreadystatechange');
            //console.log(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(xhr.responseText, objGame);
            }
        }
        //xhr.onload = this.showScores;
        xhr.send();
    },
    

};
