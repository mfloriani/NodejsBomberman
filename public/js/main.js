var Bomberman = Bomberman || {}

Bomberman.game = new Phaser.Game(640, 512, Phaser.AUTO, '');
Bomberman.game.state.add('Boot', Bomberman.Boot);
Bomberman.game.state.add('Preload', Bomberman.Preload);
Bomberman.game.state.add('MainMenu', Bomberman.MainMenu);
Bomberman.game.state.add('Game', Bomberman.Game);
Bomberman.game.state.add('HighScore', Bomberman.HighScore);

Bomberman.game.state.start('Boot');
