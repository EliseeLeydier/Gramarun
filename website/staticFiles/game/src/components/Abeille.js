class Abeille extends Phaser.GameObjects.Sprite {


    constructor(scene, x, y, texture, annimation, ecart, vitesse) {
            super(scene, x, y, texture);

            this.scene = scene;
            this.x = x;
            this.y = y;
            this.texture = texture;
            this.annimation = annimation;
            this.ecart = ecart;
            this.vitesse = vitesse;


            this.initialX = x;
            this.initialY = y;

            scene.add.existing(this);

            this.play(annimation);
        } // Fin constructor

    update() {

            if (this.x >= this.initialX + this.ecart + 1) {
                this.flipX = true;
                this.vitesse = -this.vitesse;
            } else if (this.x <= this.initialX - 1) {
                this.flipX = false;
                this.vitesse = -this.vitesse;
            }
            
            if (this.anims.currentFrame.textureFrame != 55) {
                this.x += this.vitesse;
                    
            }

        } // Fin update

}