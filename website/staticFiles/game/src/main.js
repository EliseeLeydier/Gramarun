window.addEventListener('load', function() {
    
    var game = new Phaser.Game({
        type: Phaser.AUTO,
        backgroundColor: "#242424",
        scale: {
            startFullscreen : false,
            mode: Phaser.Scale.EXACT_FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1200,
            height: 672
        },
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 1250 },
                debug : false
            }
        }
    });

    game.scene.add('Boot', Boot, true);
    game.scene.add('Preload', Preload);
    game.scene.add('Menu', Menu);
    game.scene.add('Option', Option);
    game.scene.add('Question', Question);
    game.scene.add('Level', Level);
    game.scene.add('GameOver', GameOver);
    game.scene.add('Touches', Touches);

});

class Boot extends Phaser.Scene {

    preload() {

        this.load.pack("pack", "staticFiles/game/assets/preload-asset-pack.json");

        this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("Preload"));
    }

}