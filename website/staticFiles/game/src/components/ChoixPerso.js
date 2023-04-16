class ChoixPerso {

    constructor(scene) {

        //Feuille
        const feuille = scene.add.image(scene.game.scale.width / 2, scene.game.scale.height / 2, "feuille").setScrollFactor(0);
        feuille.scaleX = 1.3;
        feuille.scaleY = 1.3;
        feuille.visible = false;

        // Texte
        const choix1 = scene.add.text(0, 0, "Choice 1", { font: "45px Helvetica bold", fill: "#006bac" }).setScrollFactor(0);
        Phaser.Display.Align.In.Center(choix1, feuille, -200, +150);
        choix1.visible = false;
        // Texte
        const choix2 = scene.add.text(0, 0, "Choice 2", { font: "45px Helvetica bold", fill: "#006bac" }).setScrollFactor(0);
        Phaser.Display.Align.In.Center(choix2, feuille, +200, +150);
        choix2.visible = false;

        // player
        const joueur1 = scene.physics.add.sprite(0, 0, "idleF", 0).setScrollFactor(0);
        Phaser.Display.Align.In.Center(joueur1, feuille, -200, 0);

        joueur1.body?.setAllowGravity?.(false)
		joueur1.scaleX = 1;
		joueur1.scaleY = 1;


        // joueur2
        const joueur2 = scene.physics.add.sprite(0, 0, "idleG", 0).setScrollFactor(0);
        Phaser.Display.Align.In.Center(joueur2, feuille, 200, 0);

        joueur2.body?.setAllowGravity?.(false)
		joueur2.scaleX = 1;
		joueur2.scaleY = 1;


        // Visible
        joueur1.visible = false;
        joueur2.visible = false;

        joueur1?.play?.("walkF");
        joueur2?.play?.("walkG");

        new PushOnClick(joueur1);
        new PushOnClick(joueur2);

        this.feuille = feuille;
        this.choix1 = choix1;
        this.choix2 = choix2;
        this.joueur1 = joueur1;
        this.joueur2 = joueur2;
        this.scene = scene;

    } // Fin constructor()

    runChoixPerso() {

        //On rend tout visible 
        this.feuille.visible = true;
        this.choix1.visible = true;
        this.choix2.visible = true;
        this.joueur1.visible = true;
        this.joueur2.visible = true;

        const vitesse = this.scene.game.scene.getScene('Option').vitesse;
        const PointDeVie = 3;


        this.joueur1?.once?.('pointerup', function(event) { 
            this.scene.game.scene.getScene('Menu').intPerso = 1;
            this.scene.game.scene.getScene('Menu').nomPerso = "idleF";
            this.scene.scene.start('Level', [vitesse, PointDeVie]);
        }, this);


        this.joueur2?.once?.('pointerup', function(event) {

            this.scene.game.scene.getScene('Menu').intPerso = 2;
            this.scene.game.scene.getScene('Menu').nomPerso = "idleG";
            this.scene.scene.start('Level', [vitesse, PointDeVie]);
        }, this);

    } // Fin runChoixPerso()

} // Fin class
module.exports = ChoixPerso;