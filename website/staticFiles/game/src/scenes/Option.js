class Option extends Phaser.Scene {

	constructor() {
		super("Option");
		
	} // Fin constructor()

	init(sceneDepart){
		this.sceneDepart = sceneDepart;
		console.log(this.sceneDepart);
	}
	
    editorCreate(){

		// fondOption
		const fondOption = this.add.image(this.game?.scale?.width/2, this.game?.scale?.height/2, "backgroundOption");
		fondOption.scaleX = 0.8;
		fondOption.scaleY = 0.8;

		// flecheMoinsButton
		const flecheMoinsButton = this.add.image(0, 0, "arrowDownButton");
		Phaser.Display.Align.In.Center(flecheMoinsButton, fondOption, 125, 0);

		// flechePlusButton
		const flechePlusButton = this.add.image(0, 0, "arrowUpButton");
		Phaser.Display.Align.In.Center(flechePlusButton, fondOption, -125, 0);


		// volumeOn
		const volumeOn = this.add.image(0, 0, "volumeOn");
		Phaser.Display.Align.In.Center(volumeOn, fondOption, 0, 60);
		volumeOn.visible = false;
		volumeOn.scaleX = 1.5;
		volumeOn.scaleY = 1.5;
		new PushOnClick(volumeOn);
		this.volumeOn = volumeOn;
		

		// volumeOff
		const volumeOff = this.add.image(0, 0, "volumeOff");
		Phaser.Display.Align.In.Center(volumeOff, fondOption, 0, 60);
		volumeOff.visible = true;
		volumeOff.scaleX = 1.5;
		volumeOff.scaleY = 1.5;
		new PushOnClick(volumeOff);
		this.volumeOff = volumeOff;



		this.son;   

		if(this.son == false){
			this.volumeOn.visible = false;
			this.volumeOff.visible = true;
				
		}
		else{
			this.volumeOn.visible = true;
			this.volumeOff.visible = false;
		}

        // difficulty
        const difficulty = this.add.text("", 0, 70);
        difficulty.setStyle({ "fontSize": "50px", color : "#006bac" });
		Phaser.Display.Align.In.Center(difficulty, fondOption, 0, 0);

		// classement
		const classement = this.add.image(0, 0, "leaderboardButton");
		classement.scaleX = 0.8;
		classement.scaleY = 0.8;
		Phaser.Display.Align.In.Center(classement, fondOption, 0, 125);

		// quitter
		const quitter = this.add.image(this.game.scale.width/2+ fondOption.width/2 -100,this.game.scale.height/2 - fondOption.height/2 +140 , "quitter");
		quitter.scaleX = 0.07;
		quitter.scaleY = 0.07;

		//configuration des touches
		const touches = this.add.image(this.game.scale.width/2 - fondOption.width/2 +100,this.game.scale.height/2 - fondOption.height/2 +140 , "keys");
		touches.scaleX = 0.10;
		touches.scaleY = 0.10;
		//Aligner quitter et fond
		//Phaser.Display.Align.In.Center(quitter, fondOption, fondOption.width/2, -fondOption.height/2);
		//Phaser.Display.Align.In.Center(quitter, fondOption, fondOption.width/2 - quitter.wi, 0);

		//annimation boutons
		new PushOnClick(quitter);
		new PushOnClick(flecheMoinsButton);
		new PushOnClick(flechePlusButton);
		new PushOnClick(classement);
		new PushOnClick(touches);

        this.quitter = quitter;
		this.fondOption = fondOption;
		this.difficulty = difficulty;
		this.flecheMoinsButton = flecheMoinsButton;
		this.flechePlusButton = flechePlusButton;
		this.classement = classement;
		this.touches = touches;

		this.touches.once?.('pointerup', function(event) {
			this.scene.launch('Touches');
			this.scene.bringToTop('Touches');
			this.scene.pause();
			
		}, this);

		this.quitter.once?.('pointerup', function(event) { 
            /*this.scene.resume('Menu');
            this.scene.resume('Level');*/
            this.scene.resume(this.sceneDepart);
            this.scene.stop()
		}, this);

		this.vitesse = this.game.scene.getScene('Menu').vitesseEnnemi;

		this.flecheMoinsButton.setInteractive?.({ useHandCursor: true }).on("pointerdown", () => {
			if(this.vitesse == 70 || this.vitesse == 90){
				this.game.scene.getScene('Menu').vitesseEnnemi -= 20;
			}
		});

		this.flechePlusButton.setInteractive?.({ useHandCursor: true }).on("pointerdown", () => {
			if(this.vitesse == 70 || this.vitesse == 50){
				this.game.scene.getScene('Menu').vitesseEnnemi += 20;
			}
		}, this);

		this.classement.setInteractive?.({ useHandCursor: true }).on("pointerdown", () => {
			window.open("http://gramarun.alwaysdata.net/leaderboard", "_blank")
		}, this);

        this.events?.emit("scene-awake");
    } // Fin editorCreate()

	setTextDifficulty(){
		var text = "";
		if(this.game.scene.getScene('Menu').vitesseEnnemi == 70 ){
			text = "Normal";
		} else if(this.game.scene.getScene('Menu').vitesseEnnemi == 50) {
			text = "Easy";
		} else if(this.game.scene.getScene('Menu').vitesseEnnemi == 90){
			text = "Hard";
		} // Fin else if
		return text;
	} // Fin setTextDifficulty

    create(){
		this.editorCreate();
    } // Fin create()

	update(){

		this.volumeOff.once('pointerup', function(event) { 
            this.volumeOn.visible = true;
			this.volumeOff.visible = false;
			this.son = true;
		}, this);

		this.volumeOn.once('pointerup', function(event) {
			this.volumeOn.visible = false;
			this.volumeOff.visible = true;
			this.son = false;
		}, this);

		this.difficulty.setText(this.setTextDifficulty());
		Phaser.Display.Align.In.Center(this.difficulty, this.fondOption, 0, 0);
	} // Fin update()

} //Fin class
////////// A décomenter pour les tests //////////
//module.exports = Option;
////////////////////////////////////////////////
