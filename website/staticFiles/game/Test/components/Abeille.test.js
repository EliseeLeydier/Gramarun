const { Scene, GameObjects } = require('phaser');
const Phaser = require('phaser');

//// Pour les tests unitaires de la classe Abeille nous sommes obligé de créer une classe mock pour Sprite .
////Et cela en raison de la super classe de la classe Abeille qui est Sprite.

// On créer une classe mock pour Sprite
class SpriteMock extends Phaser.GameObjects.GameObject {
  constructor(scene, x, y, texture) {
    super(scene, 'sprite');
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.texture = texture;
    this.displayOriginX = 0.5;
    this.displayOriginY = 0.5;
    this.depth = 0;
  }
}

// On reprends la classe Abeille et on l'adapte à la classe mock
class Abeille extends SpriteMock {
  constructor(scene, x, y, texture, animation, ecart, vitesse) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.texture = texture;
    this.animation = animation;
    this.ecart = ecart;
    this.vitesse = vitesse;
    this.initialX = x;
    this.initialY = y;
    this.flipX = false;
    this.anims = {
      currentFrame: {
        textureFrame: 0
      }
    };
    scene.add.existing(this);

  }

  update() {
    if (this.x >= this.initialX + this.ecart + 1) {
      this.flipX = true;
      this.vitesse = -this.vitesse;
    } else if (this.x <= this.initialX - 1) {
      this.flipX = false;
      this.vitesse = -this.vitesse;
    }
    if (this.anims.currentFrame.textureFrame !== 55) {
      this.x += this.vitesse;
    }
  }
}

describe('Abeille', () => {
  let scene;
  let abeille;

  beforeEach(() => {
    //// On créer une instance de la classe Scene
    scene = new Scene({ key: 'test', active: true });
    // On créer une instance de la classe GameObjects
    scene.sys = {
      updateList: { add: jest.fn(), remove: jest.fn() },
      queueDepthSort: jest.fn(),
    };
    scene.add = {
      existing: jest.fn(),
    };
    // on créer une instance de la classe Abeille
    abeille = new Abeille(scene, 0, 0, 'texture', 'animation', 10, 5);
  });

  test('On regarde que abeille et bien un objet de la classe Abeille', () => {
    expect(abeille).toBeInstanceOf(Abeille);
  });


  test('On regarde si tout les valeurs par defaut sont bonne', () => {
    expect(abeille.x).toEqual(0);
    expect(abeille.y).toEqual(0);
    expect(abeille.texture).toEqual('texture');
    expect(abeille.ecart).toEqual(10);
    expect(abeille.vitesse).toEqual(5);
  });



  test('On regarde si x se met à jour aprés update()', () => {
    const initialX = abeille.x;
    abeille.update();
    expect(abeille.x).not.toEqual(initialX);
  });



  test('On vérifie quand x et supérieur ou égale a initial x que les valeur de initialFlipX et initialVitesse on bien changer', () => {
    abeille.x = 11;
    const initialFlipX = abeille.flipX;
    const initialVitesse = abeille.vitesse;
    abeille.update();
    expect(abeille.flipX).not.toEqual(initialFlipX);
    expect(abeille.vitesse).not.toEqual(initialVitesse);
  });



  test('On vérifie quand x et inférieur à initial x-1 que la valeur de initialFlipX à pas changer et la valeur initial Vitesse a bien changer ', () => {
    abeille.x = -1;
    const initialFlipX = abeille.flipX;
    const initialVitesse = abeille.vitesse;
    abeille.update();
    expect(abeille.flipX).toEqual(initialFlipX);
    expect(abeille.vitesse).not.toEqual(initialVitesse);
  });


  test('On ne change pas la position de départ de l abeille quand la textureFrame vaut 55', () => {
    abeille.anims.currentFrame.textureFrame = 55;
    const initialX = abeille.x;
    abeille.update();
    expect(abeille.x).toEqual(initialX);
  });
});







