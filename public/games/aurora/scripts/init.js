// state states
AUR.game.state.add('game', AUR.Game);

setTimeout(function () {
	AUR.game.state.start('game');
}, 100);

console.log('init');
