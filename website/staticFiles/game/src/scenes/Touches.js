class Touches extends Phaser.Scene {
  keys;

  create() {
    // Ajouter un fond d'écran et un titre
    this.add.image(0, 0, "background").setOrigin(0);
    const fondKeys = this.add.image(
      this.game.scale.width / 2,
      this.game.scale.height / 2 - 10,
      "keysBackground"
    );
    fondKeys.scaleX = 1;
    fondKeys.scaleY = 1.05;

    this.keys = this.game.registry.get("Keys");

    if (this.keys == undefined) {
      this.keys = {
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
        m: Phaser.Input.Keyboard.KeyCodes.M,
      };
    }

    var leftKey = Object.keys(Phaser.Input.Keyboard.KeyCodes).find((key) => {
      return Phaser.Input.Keyboard.KeyCodes[key] === this.keys.left;
    });
    var rightKey = Object.keys(Phaser.Input.Keyboard.KeyCodes).find((key) => {
      return Phaser.Input.Keyboard.KeyCodes[key] === this.keys.right;
    });
    var upKey = Object.keys(Phaser.Input.Keyboard.KeyCodes).find((key) => {
      return Phaser.Input.Keyboard.KeyCodes[key] === this.keys.up;
    });
    var downKey = Object.keys(Phaser.Input.Keyboard.KeyCodes).find((key) => {
      return Phaser.Input.Keyboard.KeyCodes[key] === this.keys.down;
    });
    var jumpKey = Object.keys(Phaser.Input.Keyboard.KeyCodes).find((key) => {
      return Phaser.Input.Keyboard.KeyCodes[key] === this.keys.jump;
    });

    this.add.text(this.game.scale.width / 2 - 55, 100, "Keys", {
      font: "45px Helvetica bold",
      fill: "#006bac",
    });

    // Créer des boutons pour chaque action du joueur
    const jumpButton = this.add.text(
      350,
      200,
      `Jump : ${jumpKey.toLowerCase()}`,
      { font: "45px Helvetica bold", fill: "#006bac" }
    );
    const upButton = this.add.text(350, 250, `Up : ${upKey.toLowerCase()}`, {
      font: "45px Helvetica bold",
      fill: "#006bac",
    });
    const downButton = this.add.text(
      350,
      300,
      `Down : ${downKey.toLowerCase()}`,
      { font: "45px Helvetica bold", fill: "#006bac" }
    );
    const leftButton = this.add.text(
      350,
      350,
      `Left : ${leftKey.toLowerCase()}`,
      { font: "45px Helvetica bold", fill: "#006bac" }
    );
    const rightButton = this.add.text(
      350,
      400,
      `Right : ${rightKey.toLowerCase()}`,
      { font: "45px Helvetica bold", fill: "#006bac" }
    );

    // Ajouter des événements de clic pour chaque bouton
    jumpButton
      .setInteractive()
      .on("pointerdown", () => this.startKeyCapture(jumpButton));
    upButton
      .setInteractive()
      .on("pointerdown", () => this.startKeyCapture(upButton));
    downButton
      .setInteractive()
      .on("pointerdown", () => this.startKeyCapture(downButton));
    leftButton
      .setInteractive()
      .on("pointerdown", () => this.startKeyCapture(leftButton));
    rightButton
      .setInteractive()
      .on("pointerdown", () => this.startKeyCapture(rightButton));

    // Ajouter un bouton pour revenir à la scène des options
    const backButton = this.add.text(520, 500, "Go back", {
      font: "45px Helvetica bold",
      fill: "#006bac",
    });
    backButton.setInteractive().on("pointerdown", () => {
      this.scene.resume("Option");
      this.scene.stop("Touches");
    });
  }

  // Fonction pour capturer la touche pressée par l'utilisateur
  startKeyCapture(button) {
    var textButton = button.text.split(":")[0];
    button.setText("Enter a key...");
    this.input.keyboard.once("keydown", (event) => {
      if (event.key == " ") {
        button.setText(`${textButton}: space`);
      } else {
        button.setText(`${textButton}: ${event.key.toLowerCase()}`);
      }
      switch (textButton) {
        case "Jump ":
          this.keys.jump = event.keyCode;
          break;
        case "Up ":
          this.keys.up = event.keyCode;
          break;
        case "Down ":
          this.keys.down = event.keyCode;
          break;
        case "Left ":
          this.keys.left = event.keyCode;
          break;
        case "Right ":
          this.keys.right = event.keyCode;
          break;
      }
    });
    this.game.registry.set("Keys", this.keys);
  }
}
