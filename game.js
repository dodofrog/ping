const gameState = {
	score1: 0,
	score2: 0
}

function preload () {
	this.load.image('player', 'wall.png');
	this.load.image('enemy', 'wall.png');
	this.load.image('ping', 'ping.png');
	this.load.image('start', 'start.png');
	this.load.image('ball', 'ball.png');
	this.load.image('leftEdge', 'sideEdge.png');
	this.load.image('rightEdge', 'sideEdge.png');
	this.load.image('topEdge', 'notSideEdge.png');
	this.load.image('downEdge', 'notSideEdge.png');
}

function create() {
	gameState.logo = this.add.image(490, 55, 'ping');
	gameState.startButton = this.add.image(500, 365, 'start');
	gameState.two = this.add.text(100, 120, 'W: UP                      Up Arrow Key: UP', { fontSize: '30px', fill: '#ffffff'});
	gameState.three = this.add.text(100, 170, 'S: DOWN                    Down Arrow Key: DOWN', { fontSize: '30px', fill: '#ffffff'});
	gameState.score1Text = this.add.text(320, 15, "", { fontSize: '70px', fill: '#ffffff' });
	gameState.score2Text = this.add.text(635, 15, "", { fontSize: '70px', fill: '#ffffff' })

	this.input.on('pointerup', () => {
		gameState.startButton.destroy();
		gameState.logo.destroy();
		gameState.two.destroy();
		gameState.three.destroy();
		gameState.score1Text.setText(`${gameState.score1}`);
		gameState.score2Text.setText(`${gameState.score2}`);
		this.ball.setVelocityX(-600);
		this.ball.setVelocityY(0);
	})

	this.player = this.physics.add.sprite(0, 250, 'player');
	this.enemy = this.physics.add.sprite(1000, 250, 'enemy');
	this.ball = this.physics.add.sprite(500, 250, 'ball');
	this.leftEdge = this.physics.add.sprite(1,1, 'leftEdge');
	this.rightEdge = this.physics.add.sprite(999,0, 'rightEdge');
	this.topEdge = this.physics.add.sprite(1,1, 'topEdge');
	this.downEdge = this.physics.add.sprite(0,499, 'downEdge');

	this.player.setCollideWorldBounds(true);
	this.enemy.setCollideWorldBounds(true);

	this.player.setInteractive();
	this.enemy.setInteractive();
	this.leftEdge.setInteractive();
	this.rightEdge.setInteractive();
	this.topEdge.setInteractive();
	this.downEdge.setInteractive();


	this.physics.add.overlap(this.ball, this.enemy, () => {
		const velX = this.ball.body.velocity.x;
		const velY = this.ball.body.velocity.y;
		const vArray = enemyMath(this.enemy.y, this.ball.y, this.ball.body.velocity.x, this.ball.body.velocity.y);
		this.ball.body.velocity.x = vArray[0];
		this.ball.body.velocity.y = vArray[1];
		this.ball.setAccelerationY((this.ball.body.velocity.y) / .8);
		this.ball.setVelocityX(this.ball.body.velocity.x * 1.05);
	});

	this.physics.add.overlap(this.ball, this.player, () => {
		const velX = this.ball.body.velocity.x;
		const velY = this.ball.body.velocity.y;
		const vArray = playerMath(this.player.y, this.ball.y, this.ball.body.velocity.x, this.ball.body.velocity.y);
		this.ball.body.velocity.x = vArray[0];
		this.ball.body.velocity.y = vArray[1];
		this.ball.setAccelerationY((this.ball.body.velocity.y) / .8);
		this.ball.setVelocityX(this.ball.body.velocity.x * 1.05);
	});

	this.physics.add.overlap(this.ball, this.rightEdge, () => {
		this.ball.x = 500;
		this.ball.y = 250;
		this.ball.setVelocityX(0);
		this.ball.setVelocityY(0);
		gameState.score1 += 1;
		gameState.score1Text.setText(`${gameState.score1}`);
		this.ball.setAccelerationY(0);
		this.ball.setAccelerationX(0);
	});

	this.physics.add.overlap(this.ball, this.leftEdge, () => {
		this.ball.x = 500;
		this.ball.y = 250;
		this.ball.setVelocityX(0);
		this.ball.setVelocityY(0);
		gameState.score2 += 1;
		gameState.score2Text.setText(`${gameState.score2}`);
		this.ball.setAccelerationY(0);
		this.ball.setAccelerationX(0);
	});

	this.physics.add.overlap(this.ball, this.topEdge, () => {
		this.ball.setVelocityY(-(this.ball.body.velocity.y));
		this.ball.setAccelerationY(0);
	});

	this.physics.add.overlap(this.ball, this.downEdge, () => {
		this.ball.setVelocityY(-(this.ball.body.velocity.y));
		this.ball.setAccelerationY(0);
	});
}

function update () {
	const cursors = this.input.keyboard.createCursorKeys();
	const W = this.input.keyboard.addKey('W');
	const S = this.input.keyboard.addKey('S');
	const speed = 400;
	
	if(S.isDown){
		this.player.setVelocityY(speed)
	} else if (W.isDown) {
		this.player.setVelocityY(-speed)
	} else {
		this.player.setVelocityY(0);
	}

	if(cursors.down.isDown){
		this.enemy.setVelocityY(speed)
	} else if (cursors.up.isDown) {
		this.enemy.setVelocityY(-speed)
	} else {
		this.enemy.setVelocityY(0);
	}

}

function playerMath(wall, pos, x, y) {
	const rel = wall + 50 - pos;
	const norm =  rel / 50;
	const angle = norm * (5 * Math.PI / 13);
	const origSpeed = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

	const vx = origSpeed * Math.sin(angle);
	const vy = origSpeed * -Math.cos(angle);
	return [vx, vy];
}

function enemyMath(wall, pos, x, y) {
	const rel = wall + 50 - pos;
	const norm =  rel / 50;
	const angle = norm * (5 * Math.PI / 13);
	const origSpeed = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

	const vx = origSpeed * -Math.sin(angle);
	const vy = origSpeed * Math.cos(angle);
	return [vx, vy];
}

const config = {
	type: Phaser.AUTO,
	width: 1000,
	height: 500,
	backgroundColor: "8bb584",
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 0},
			enableBody: true,
			debug: false,
		}
	},
	scene: {preload, create, update, playerMath, enemyMath}
}

const game = new Phaser.Game(config)
