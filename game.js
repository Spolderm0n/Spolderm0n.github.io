const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: '#000'
};

const game = new Phaser.Game(config);
let player;
let fallingObjects;
let score = 0;
let scoreText;

function preload() {
    this.load.image('sky', 'sky.png');
    this.load.image('basket', 'basket.png');
    this.load.image('apple', 'apple.png');
    this.load.image('bomb', 'bomb.png');
}

function create() {
    this.add.image(config.width / 2, config.height / 2, 'sky').setScale(1.5).setOrigin(0.5);

    player = this.physics.add.sprite(config.width / 2, config.height - 50, 'basket').setScale(0.1).setOrigin(0.5);
    player.setCollideWorldBounds(true);

    fallingObjects = this.physics.add.group({
        key: 'apple',
        repeat: 5,
        setXY: { x: 12, y: 0, stepX: 150 }
    });

    fallingObjects.children.iterate(function (child) {
        child.setScale(0.05).setOrigin(0.5);
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.checkWorldBounds = true;
        child.outOfBoundsKill = true;
    });

    this.physics.add.collider(player, fallingObjects, collectObject, null, this);

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
}

function update() {
    if (player) {
        if (this.input.activePointer.isDown) {
            player.x = this.input.x;
        }
    }

    // Adjust the probability of creating an apple or a bomb
    if (Phaser.Math.Between(0, 20) < 1) {
        createFallingObject.call(this, 'apple');
    } else if (Phaser.Math.Between(0, 20) < 1) {
        createFallingObject.call(this, 'bomb');
    }
}

function createFallingObject(objectType) {
    const x = Phaser.Math.Between(50, config.width - 50);
    const y = Phaser.Math.Between(0, 100);

    const fallingObject = fallingObjects.create(x, y, objectType);
    fallingObject.setScale(0.05).setOrigin(0.5);
    fallingObject.setVelocityY(Phaser.Math.Between(100, 200));
    fallingObject.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    fallingObject.checkWorldBounds = true;
    fallingObject.outOfBoundsKill = true;
}

function collectObject(player, fallingObject) {
    fallingObject.disableBody(true, true);

    if (fallingObject.texture.key === 'apple') {
        score += 1;
    } else if (fallingObject.texture.key === 'bomb') {
        score -= 1;
    }

    scoreText.setText('Score: ' + score);
}
