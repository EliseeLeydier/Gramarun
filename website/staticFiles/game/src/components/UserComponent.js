class UserComponent {

    /**
     * @param {Phaser.GameObjects.GameObject} gameObject The entity.
     */
    constructor(gameObject) {

        this.scene = gameObject.scene;

        const listenAwake = this.awake !== UserComponent.prototype.awake;
        const listenStart = this.start !== UserComponent.prototype.start;
        const listenUpdate = this.update !== UserComponent.prototype.update;
        const listenDestroy = this.destroy !== UserComponent.prototype.destroy;
        
        if (this.scene && this.scene.events) {

            this.scene.events.once("scene-awake", this.awake, this);
        } // Fin if

        if (listenStart) {

            this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
        } // Fin if

        if (listenUpdate) {

            this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        } // Fin if

        if (listenStart || listenUpdate || listenDestroy) {

            gameObject.on(Phaser.GameObjects.Events.DESTROY, () => {

                this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.start, this);
                this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);

                if (listenDestroy) {

                    this.destroy();
                } // Fin if
            });
        } // Fin if
    } // Fin constructor()

    /** @type {Phaser.Scene} */
    scene;

    awake() {
        
    }

    start() {
        
    }

    update() {
        
    }

    destroy() {
        
    }
}
module.exports = UserComponent;