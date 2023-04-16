class Mouvement {

    // const
    X_ACCELERATION = 25;
    X_INERTIE = 0.1;
    MAX_X_SPEED = 10000;

    // var
    gameObject;
    isDashing = false;
    hasDashed = false;
    jump = false;
    jumpBegin = 0;
    dashVel = 500;
    dashTime = 0;
    keys = undefined;
    animComplete = () => { this.gameObject.anims.pause(this.gameObject.anims.currentAnim.frames[-1]); }


    constructor(gameObject, nomJoueur) {
            this.gameObject = gameObject;
            this.nomJoueur = nomJoueur;
            this.aJouer = false; 
            gameObject["__Mouvement"] = this;

            const scene = this.gameObject.scene


            this.keys = scene.game?.registry?.get?.('Keys');
            if(this.keys == undefined){
                this.cursors = scene?.input?.keyboard?.addKeys({

                    'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
                    'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
                    'up': Phaser.Input.Keyboard.KeyCodes.UP,
                    'down': Phaser.Input.Keyboard.KeyCodes.DOWN,
                    'jump': Phaser.Input.Keyboard.KeyCodes.SPACE,
                    'm': Phaser.Input.Keyboard.KeyCodes.M,
                });
            }
            else{
                this.cursors = scene.input.keyboard.addKeys({
                    'left': this.keys.left,
                    'right': this.keys.right,
                    'up': this.keys.up,
                    'down': this.keys.down,
                    'jump': this.keys.jump,
                    'm': Phaser.Input.Keyboard.KeyCodes.M,
                });
            }
            
            this.scene = scene;

            scene?.events?.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        } // Fin constructeur()

    /** @returns {Mouvement} */
    static getComponent(gameObject) {
            return gameObject["__Mouvement"];
        } // Fin getComponent()

    isOnFloor() {
            return this.gameObject.body.onFloor();
        } // Fin isOnFloor()

    getNow() {
            return this.gameObject.scene.time.now; // time in milliseconds
        } // Fin getNow()

    updateCursor(){
        this.keys = scene.game?.registry?.get?.('Keys');
        this.cursors = scene.input?.keyboard?.addKeys({
            'left': this.keys.left,
            'right': this.keys.right,
            'up': this.keys.up,
            'down': this.keys.down,
            'jump': this.keys.jump,
            'm': Phaser.Input.Keyboard.KeyCodes.M,
        });
    }

    // implémenté update
    updateVelocity() {
            this.gameStop = false;
            if (!this.isDashing) {
                // x movement
                this.gameObject.body.velocity.x += (this.cursors?.right?.isDown - this.cursors?.left?.isDown) * this.X_ACCELERATION;
                this.gameObject.body.velocity.x = Phaser.Math.Clamp(this.gameObject.body.velocity.x, -this.MAX_X_SPEED, this.MAX_X_SPEED);
                this.gameObject.body.velocity.x = Phaser.Math.Linear(this.gameObject.body.velocity.x, 0, this.X_INERTIE);

                if (this.cursors && this.cursors.m && this.cursors.m.isDown) {
                    this.gameObject.body.velocity.y = -500
                } // Fin if

                // y movement

                if (this.cursors && this.cursors.jump && this.cursors.jump.isDown || this.cursors && this.cursors.jump && this.cursors.jump.isDown) {

                    // animation
                    if (this.gameObject.body.velocity.y <= 0) {
                        if (this.nomJoueur == "idleF") {
                            this.gameObject.play("jumpF", true).on("animationcomplete", this.animComplete);
                        } else if (this.nomJoueur == "idleG") {
                            this.gameObject?.play?.("jumpG", true).on("animationcomplete", this.animComplete);
                        } // Fin else if
                    } // Fin if
                    

                    // adaptative jump
                    if (this.isOnFloor() && this.jump === false) {
                        this.jump = true;
                        this.jumpBegin = this.getNow()
                    } else if (this.getNow() - this.jumpBegin < 100) {
                        this.gameObject.body.velocity.y = -300;
                    } else if (this.getNow() - this.jumpBegin >= 100 && this.getNow() - this.jumpBegin < 325) {
                        this.gameObject.body.velocity.y = -400 + Math.floor((this.getNow() - this.jumpBegin) / 1.7);
                    } // Fin else if

                } // Fin if


                if (this.cursors && this.cursors.jump && Phaser.Input.Keyboard.JustDown(this.cursors.jump) && this.hasDashed === false && !this.isOnFloor()) {

                    this.hasDashed = true;
                    this.isDashing = true;
                    this.dashTime = this.getNow();
                    this.dash();
                } // Fin if

                if (this.isOnFloor()) {
                    if (this.hasDashed && !this.isDashing) {
                        this.hasDashed = false;
                    } // Fin if

                   if (this.cursors.hasOwnProperty('jump') && !this.cursors.jump.isDown && this.cursors.hasOwnProperty('jump') && !this.cursors.jump.isDown) {

                        this.jump = false;
                    } // Fin if

                } // Fin if

            } else if (this.getNow() - this.dashTime > 150) { // Fin du dash
                this.isDashing = false;
                this.gameObject.body.setAllowGravity(true);
                this.gameObject.body.velocity.x /= 2;
                this.gameObject.body.velocity.y /= 2;

            } // Fin else if

        } // Fin updateVelocity()

    // implémenté dash
    dash() {
            this.gameObject.body?.setAllowGravity?.(false);
            this.gameObject.body.velocity.x = this.cursors.right.isDown - this.cursors.left.isDown;
            this.gameObject.body.velocity.y = this.cursors.down.isDown - this.cursors.up.isDown;
            this.gameObject.body.velocity?.normalize?.();
            this.gameObject.body.velocity.x *= this.dashVel;
            this.gameObject.body.velocity.y *= this.dashVel;
        } // Fin dash()

    direction() {
            if (this.cursors.left.isDown) {
                this.gameObject.flipX = true;
            }
            if ((this.cursors.right.isDown || this.cursors.left.isDown)) {
                if (this.isDashing) {
                    if (this.nomJoueur == "idleF") {
                        this.gameObject.play("dashF", true).on("animationcomplete", this.animComplete);
                    } else if (this.nomJoueur == "idleG") {
                        this.gameObject.play("dashG", true).on("animationcomplete", this.animComplete);
                    } // Fin else if
                } else if (this.gameObject.body.velocity.y > 0) {
                    if (this.nomJoueur == "idleF") {
                        this.gameObject.play("fallF", true).on("animationcomplete", this.animComplete);
                    } else if (this.nomJoueur == "idleG") {
                        this.gameObject.play("fallG", true).on("animationcomplete", this.animComplete);
                    } // Fin else if
                } else if (!this.gameObject.body.velocity.y) {
                    if (this.nomJoueur == "idleF") {
                        this.gameObject.play("walkF", true);
                    } else if (this.nomJoueur == "idleG") {
                        this.gameObject.play("walkG", true);
                    } // Fin else if 
                }
            } else {
                this.gameObject.play(this.nomJoueur, true);
            } // Fin else
        } // Fin direction

    update() {
        setTimeout(() => {
            if (typeof this.gameObject.body !== "undefined" && this.gameObject.body !== null) {
                //this.gameObject.play(this.nomJoueur, true);
                this.gameObject.flipX = false;
                this.direction();
                this.updateVelocity();
                if(this.keys != undefined){
                    this.updateCursor();
                } 
            } // Fin if 

        }, 100);
        
        // 100 millisecondes de temporisation

    } // Fin update()
}
module.exports = Mouvement;