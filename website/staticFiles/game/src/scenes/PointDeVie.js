class PointDeVie extends Phaser.GameObjects.Image {

	constructor(scene) {
		super(scene, scene.game.scale.width -70, 30, "3vies");
		this.pntDeVie = 3;
		this.setScrollFactor(0);
		this.scene = scene;
		scene.add.existing(this);
		this.scaleX = 2/3;
		this.scaleY = 2/3;
	} // Fin constructor

	perdVie(){
		if(this.pntDeVie == 2){
			this.setTexture("2vies");
		}
		else if(this.pntDeVie == 1){
			this.setTexture("1vies");
		}
		else if(this.pntDeVie == 0){
            this.scene.scene.launch('GameOver',{APerdu: true})
			this.scene.scene.stop('Level');
		} // Fin if else
		
	} // Fin perdVie()

} // Fin class
