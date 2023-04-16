class Level extends Phaser.Scene {
  static instanceCount = 0;
  isTouched = false;
  pointDeViePerso = 0;
  carte = null;
  fond = null;
  platforme = null;
  deco = null;
  joueur = null;
  ennemi = null;
  porte = null;
  ennemiphysique = null;
  listeNPC = [];
  scenePointDeVie = null;

  constructor() {
    super({ key: "Level" });
    }

  // Fonction qui permet de lancer la scene
  init(arg) {
    this.resetListeNPC();
    this.incrementInstanceCount();
    const jsonData = this.cache?.json?.get("initMap");
    const mapIndex = this.getMapIndex();
    this.tuile = jsonData?.[mapIndex]["tuile"];
    this.nomMap = jsonData?.[mapIndex]["nomMap"];
    this.coordonePerso = jsonData?.[mapIndex]["perso"];
    this.coordonePorte = jsonData?.[mapIndex]["coordonePorte"];
    this.fantome = jsonData?.[mapIndex]["fantome"];
    this.dicNPC = jsonData?.[mapIndex]["dicNPC"];
    this.pointDeViePerso = this.getPointDeVie();
  }
  // réinitialise la liste des NPC
  resetListeNPC() {
    this.listeNPC = [];
  }
  // crée les différents éléments de la scène et initialise des variables
  create() {
    this.createEditor();
    this.addEvents();
    this.aBouger = false;
  }
  // diminue le point de vie du joueur et met à jour l'interface graphique correspondante
  joueurPerdUneVie() {
    this.scenePointDeVie.pntDeVie -= 1;
    this.pointDeViePerso -= 1;
    this.scenePointDeVie.perdVie();
  }

  // met à jour la scène à chaque frame (déplacement des personnages, collisions, etc.).
  update() {
    this.checkPlayerMovement();
    this.moveEnemyTowardsPlayer();
    this.updateNPCs();
    this.checkEnemyPlayerCollision();
    if (this.joueur.y > 624) {
      this.joueurPerdUneVie();
    }

    const distance = Phaser.Math.Distance.Between(
      this.joueur.x,
      this.joueur.y,
      this.porte.x,
      this.porte.y
    );
    if (distance < 350) {
      this.porte.play("ouverture-porte", 10);
    } else if (distance >= 350) {
      this.porte.play("fermeture-porte", 10);
    }

    if (distance < 80) {
      this.launchQuestionScene();
    }
  }

  // incrémente le compteur d'instances de la classe Level
  incrementInstanceCount() {
    Level.instanceCount++;
  }

  // retourne l'indice de la carte à utiliser en fonction du compteur
  getMapIndex() {
    return Level.instanceCount % 2;
  }

  // retourne le point de vie du joueur stocké dans la scène de Menu
  getPointDeVie() {
    return this.game.scene.getScene("Menu").pointDeVie;
  }

  // crée les éléments de la scène et initialise des variables, utilisé pour initialiser la scène et lors du redémarrage de la scène après une question
  createEditor() {
    if (this.game.scene.getScene("Menu").intPerso === 0) {
      this.launchQuestionScene();
    }

    this.createMap();
    this.createPlayer();
    this.createEnemy();
    this.createDoor();
    this.createNPCs();
    this.createHealthBar();
    this.addCollisions();
    this.setCamera();
    this.joueur.setCollideWorldBounds(true);
    this.aBouger = false;
  }

  // crée la carte à partir des données JSON
  createMap() {
    const carte = this.make.tilemap({ key: this.nomMap });
    this.carte = carte;
    const tileSet = carte.addTilesetImage(this.tuile?.[0], this.tuile?.[0]);
    this.fond = carte.createLayer("fond", [tileSet]);
    this.platforme = carte.createLayer("platforme", [tileSet]);
    this.deco = carte.createLayer("deco", [tileSet]);
    this.physics.world.setBounds(
      0,
      0,
      this.carte.widthInPixels,
      this.carte.heightInPixels + 48
    );
    this.platforme.setCollisionByProperty({ estSolide: true });
  }

  // crée le personnage jouable
  createPlayer() {
    const joueur = this.physics.add
      .sprite(
        this.coordonePerso.x,
        this.coordonePerso.y,
        this.game.scene.getScene("Menu").nomPerso,
        0
      )
      .setScrollFactor(0);
    joueur.scale = 1 / 3;
    new Physics(joueur);
    new Mouvement(joueur, this.game.scene.getScene("Menu").nomPerso);
    this.joueur = joueur;
  }

  // crée l'ennemi
  createEnemy() {
    const ennemi = this.add
      .sprite(this.fantome.x, this.fantome.y, "ennemyFly", 10)
      .setScrollFactor(0);
    ennemi;
    ennemi.scale = 1 / 3;
    this.ennemiphysique = new Physics(ennemi);
    this.physics.add.collider(ennemi, this.joueur);
    this.ennemi = ennemi;
  }

  // crée la porte
  createDoor() {
    const porte = this.add
      .sprite(this.coordonePorte.x, this.coordonePorte.y, "porteSpriteOuvrir")
      .setScrollFactor(0);
    porte.scale = 1 / 2;
    new Physics(porte).static = true;
    this.physics.add.collider(porte, this.joueur);
    this.physics.add.collider(porte, [this.platforme, this.joueur]);
    this.porte = porte;
  }

  // crée les NPC à partir des données JSON
  createNPCs() {
    for (const [key, value] of Object.entries(this.dicNPC)) {
      const abeille = new Abeille(
        this,
        value.cooX,
        value.cooY,
        value.texture,
        value.annimation,
        value.ecart,
        value.vitesse
      ).setScrollFactor(0);
      this.listeNPC.push(abeille);
    }
  }

  // crée l'interface graphique pour afficher le point de vie du joueur
  createHealthBar() {
    this.scenePointDeVie = new PointDeVie(this);
    this.scenePointDeVie.pntDeVie = this.pointDeViePerso;
    this.scenePointDeVie.perdVie();
  }

  // ajoute les collisions entre les éléments de la scène
  addCollisions() {
    this.physics.add.collider(this.joueur, [this.platforme]);
  }

  // définit les limites et les paramètres de la caméra
  setCamera() {
    this.cameras.main.setBounds(
      0,
      0,
      this.carte.widthInPixels,
      this.carte.heightInPixels
    );
    this.cameras.main.roundPixels = true;
    this.cameras.main.flash();
  }

  // ajoute des événements (par exemple, la touche ENTER pour ouvrir le menu)
  addEvents() {
    this.input.keyboard.on("keydown-ENTER", () => {
      this.launchOptionScene();
    });
  }

  // lance la scène de question
  launchQuestionScene() {
    this.scene.launch("Question");
    this.scene.pause("Level");
    this.scene.sendToBack();
  }

  // lance la scène d'options
  launchOptionScene() {
    this.scene.launch('Option', "Level");
    this.scene.pause("Level");
    this.scene.sendToBack();
  }

  // vérifie si le joueur est en mouvement
  checkPlayerMovement() {
    setTimeout(() => {
      if (
        Math.abs(this.joueur.body.velocity.x) > 3 ||
        Math.abs(this.joueur.body.velocity.y) > 3
      ) {
        this.aBouger = true;
      }
    }, 100);
  }

// déplace l'ennemi vers le joueur
moveEnemyTowardsPlayer() {
  if (this.aBouger) {
    this.physics.moveToObject(
      this.ennemi,
      this.joueur,
      this.game.scene.getScene("Menu").vitesseEnnemi
    );
  } else {
    if (this.ennemi.body) {
      this.ennemi.body.velocity.x = 0; // Arrête l'ennemi s'il est en mouvement
      this.ennemi.body.velocity.y = -20; // Arrête l'ennemi s'il est en mouvement
    }
  }
  this.ennemi.play("idleN", true);
}

  // met à jour les NPC si le joueur est en mouvement
  updateNPCs() {
    if (this.aBouger) {
      for (const npc of this.listeNPC) {
        npc.update();
      }
    }
  }

  // vérifie s'il y a une collision entre le joueur et l'ennemi
  checkEnemyPlayerCollision() {
    if (
      this.joueur.x - 32 <= this.ennemi.x + 32 &&
      this.joueur.x + 32 >= this.ennemi.x - 32 &&
      this.joueur.y - 32 <= this.ennemi.y + 32 &&
      this.joueur.y + 32 >= this.ennemi.y - 32
    ) {
      this.joueurPerdUneVie();
      this.ennemi.x -= 100;
      this.ennemi.y -= 100;
    }
  }
}
////////// A décomenter pour les tests //////////
//module.exports = Level;
////////////////////////////////////////////////