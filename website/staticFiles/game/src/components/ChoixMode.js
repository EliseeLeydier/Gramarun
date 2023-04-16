class ChoixMode {

    constructor(scene, intPerso) {


        //Feuille
        const feuille = scene.add.image(scene.game.scale.width / 2, scene.game.scale.height / 2, "feuille").setScrollFactor(0);        
        feuille.scaleX = 1.3;
        feuille.scaleY = 1.3;
        feuille.visible = false;


        // Texte
        const choixTexte = scene.add.text(0, 0, "Mode selection : ", { font: "45px Helvetica bold", fill: "#006bac" }).setScrollFactor(0);
        Phaser.Display.Align.In.Center(choixTexte, feuille, 0, -125);
        choixTexte.visible = false;


        // player
        const choix1 = scene.physics.add.sprite(0, 0, "normalMode", 0).setScrollFactor(0);
        Phaser.Display.Align.In.Center(choix1, feuille, 0, -25);
        //le ? c'est pour dire que si choix1.body existe alors on fait le setAllowGravity sinon on fait rien
        choix1.body?.setAllowGravity?.(false)
        // choix2
        const choix2 = scene.physics.add.sprite(0, 0, "qcmMode", 0).setScrollFactor(0);
        Phaser.Display.Align.In.Center(choix2, feuille, 0, 100);
        //le ? c'est pour dire que si choix1.body existe alors on fait le setAllowGravity sinon on fait rien
        choix2.body?.setAllowGravity?.(false) 


        // Visible
        choix1.visible = false;
        choix2.visible = false;

        new PushOnClick(choix1);
        new PushOnClick(choix2);

        this.feuille = feuille;
        this.choixTexte = choixTexte;
        this.choix1 = choix1;
        this.choix2 = choix2;
        this.scene = scene;

    } // Fin constructor()

    runChoixPerso() {

        //On rend tout visible 
        this.feuille.visible = true;
        this.choixTexte.visible = true;
        this.choix1.visible = true;
        this.choix2.visible = true;

        const vitesse = this.scene.game.scene.getScene('Option').vitesse;
        const PointDeVie = 3;
        const questionRecap = [
            [], 0
        ];
        /* Question recap : 
          [0] Liste ID question passÃ©
          [1] nombre question bonne
        */


        // choix : nornmal, on va lancer choixPerso
        this.choix1?.once?.('pointerup', function (event) {
            this.feuille.visible = false;
            this.choixTexte.visible = false;
            this.choix1.visible = false;
            this.choix2.visible = false;
            return;
        }, this);

        // choix : qcm
        this.choix2?.once?.('pointerup', function (event) {
            this.scene.game.scene.getScene('Menu').intPerso = 0;
            this.scene.scene.start('Level', [vitesse, PointDeVie]);
        }, this);


    } // Fin runChoixPerso()

} // Fin class
module.exports = ChoixMode;