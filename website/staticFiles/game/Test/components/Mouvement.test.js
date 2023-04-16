const { Scene } = require('phaser');
const Mouvement = require('../../src/components/Mouvement');


// Définir 'scene.physics' comme un objet vide pour éviter une erreur
const mockSprite = {
  setScrollFactor: jest.fn(() => mockText),
  setTexture: jest.fn(),
  setOrigin: jest.fn(),
  setFlipX: jest.fn(),
  setDepth: jest.fn(),
};


const scene = {
  add: {
    sprite: jest.fn(() => mockSprite),
  },
  physics: {
    add: {
      sprite: jest.fn(() => mockSprite),
      body: {
        setGravityY: jest.fn(),
        setCollideWorldBounds: jest.fn(),
        setBounce: jest.fn(),
        setVelocityX: jest.fn(),
        setVelocityY: jest.fn(),
      },
    },
  },
  game: {
    scale: {
      width: 800,
      height: 600,
    },
  },
  input: { // Ajout de la propriété input
    keyboard: {
      addKeys: jest.fn(() => ({
        left: { isDown: false },
        right: { isDown: false },
        up: { isDown: false },
        down: { isDown: false },
        jump: { isDown: false },
      })),
    },
    on: jest.fn(),
  },
  events: { // Ajout de la propriété events
    on: jest.fn(),
  },
 
};




describe('Mouvement', () => {
  let player;
  let mouvement;

  beforeEach(() => {
    // Créer un objet de joueur pour le test
    const gameObjectMock = scene.physics.add.sprite(0, 0, 'player');
    gameObjectMock.body = {
      velocity: {
        x: 0,
        y: 0
      },
      onFloor: jest.fn(() => true),

    };

// Ajout de la propriété scene
    gameObjectMock.scene = {
      time: {
        now: jest.fn(() => Date.now()),
      }
    };
    player = gameObjectMock;
    mouvement = new Mouvement(player, 'idleG');

    player.cursors = {
      jump: {
        _justDown: false,
      },
    }
    //On ajoute les touches du clavier à la propriété cursors de mouvement
    mouvement.cursors = scene.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,

    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('On devrait pouvoir obtenir le composant Mouvement pour un Gameobject', () => {
    const result = Mouvement.getComponent(player);
    expect(result).toBe(mouvement);
  });



  it('On devrait pouvoir déplacer le joueur de gauche à droite', () => {

    // Vérifier que le joueur ne bouge pas initialement
    expect(player.body.velocity.x).toBe(0);


    // Appuyer sur la touche de droite
    mouvement.cursors.right.isDown = true;
    mouvement.updateVelocity();

    // Verifier que le joueur bouge à droite
    expect(player.body.velocity.x).toBe(22.5);

    // Appuyer sur la touche de gauche
    mouvement.cursors.right.isDown = false;
    mouvement.cursors.left.isDown = true;
    mouvement.updateVelocity();

    // Vérifier que le joueur bouge à gauche 
    expect(player.body.velocity.x).toBe(-2.25);
  });


  it('On devrait pouvoir faire sauter le joueur et vérifier son état au début et a la fin', () => {
    // Vérifier que le joueur ne saute pas initialement
    expect(mouvement.jump).toBe(false);

    // Appuyer sur la touche d'espace
    mouvement.cursors.jump.isDown = true;
    mouvement.updateVelocity();

    // Vérifier que le joueur saute
    expect(mouvement.jump).toBe(true);

    // Relâcher la touche d'espace
    mouvement.cursors.jump.isDown = false;
    mouvement.updateVelocity();
    // Vérifier que le joueur ne saute plus
    expect(mouvement.jump).toBe(false);
  });

 
  it('On devrait pouvoir faire dasher le joueur', () => {
    // Vérifier que le joueur ne dash pas initialement
    expect(mouvement.isDashing).toBe(false);
  
    // Appuyer sur la touche "jump" et une autre touche diretionelle pour orienter le dash
    mouvement.cursors.jump.isDown = true;
    mouvement.cursors.jump._justDown = true;
    mouvement.cursors.left.isDown = true;
    //on et pas sur le sol
    player.body.onFloor = jest.fn(() => false);

    mouvement.updateVelocity();
  
    // Vérifier que le joueur dash
    expect(mouvement.isDashing).toBe(true);

  });
  

});