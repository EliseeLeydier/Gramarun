class Menu extends Phaser.Scene {

    init() {
        const questionRecap = [[], 0];
        this.questionRecap = questionRecap;
        this.intPerso = 0;
        this.vitesseEnnemi = 70;
        this.pointDeVie = 3;
        /* Question recap : 
          [0] Liste ID question passé
          [1] nombre question bonne
        */

    } // Fin constructor()

    /** @returns {void} */
    editorCreate() {

        // est en plein écran 
        const pleinEcran = false;
        this.pleinEcran = pleinEcran;

        // fond
        const fond = this.add.tileSprite(0, 0, 1200, 672, "background");
        fond.setOrigin(0, 0);

        // titre
        const titre = this.add.image(0, 0, "logo");

        //Aligner titre et fond
        Phaser.Display.Align.In.Center(titre, fond, 0, -175);

        // start
        const titreStart = this.add.image(500, 550, "start");
        titreStart.scaleX = 0.75;
        titreStart.scaleY = 0.75;


        //Aligner titre et fond
        Phaser.Display.Align.In.Center(titreStart, fond, 0, 225);

        // joueur
        const joueur = this.add.sprite(59, 405, "idleF", 0);
        joueur.scaleX = 1 / 2;
        joueur.scaleY = 1 / 2;
        joueur.play('walkF');

        // engrenage
        const engrenage = this.add.image(950, 70, "engrenage");
        engrenage.scaleX = 0.15;
        engrenage.scaleY = 0.15;

        //Aligner engrenage et fond
        Phaser.Display.Align.In.Center(engrenage, fond, +525, -275);

        //animation boutons
        new PushOnClick(engrenage);


        //on importe choixPerso et choixMode

        const choixPerso = new ChoixPerso(this);
        const choixMode = new ChoixMode(this);

        //quand on appuie sur entrer, on run le jeu
        this.input?.keyboard?.on('keydown-ENTER', function () {
            choixMode.runChoixPerso();
            choixPerso.runChoixPerso();
        }, this);

        this.bringToTop;

        this.fond = fond;
        this.engrenage = engrenage;

        this.game.scene.getScene('Option').vitesse = 70;
        this.game.scene.getScene('Option').son = false;

        this.events?.emit("scene-awake");


    } // Fin editorCreate()

    /** @type {Phaser.GameObjects.TileSprite} */
    fond;
    /** @type {Phaser.GameObjects.Image} */
    engrenage;


    create() {
        this.editorCreate();



    } // Fin create()


    update() {
        /////////// A MODIFIER POUR LE BOUTON PLEIN ECRAN ///////////
        /*if (document.getElementById("playButton").style.display == "none" && this.pleinEcran == false) {
            this.pleinEcran = true;
            this.scale.startFullscreen();
        } */// Fin if

        //quand on clique sur l'engrenage, on affiche le menu
        this.engrenage?.once?.('pointerup', function () {
            this.scene.launch('Option', "Menu");
            this.scene.pause('Menu');
        }, this);

        // Faire bouger l'arrière plan
        this.fond.tilePositionX += 0.7;

    } // Fin update()

} //Fin class

//on exporte la classe Menu


////////// A décomenter pour les tests //////////
//module.exports = Menu;
////////////////////////////////////////////////

