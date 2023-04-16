const Phaser = require('phaser');
const Menu = require('../../src/scenes/Menu');
const ChoixMode = jest.fn();
const ChoixPerso = jest.fn();
const PushOnClick = jest.fn();
globalThis.ChoixMode = ChoixMode;
globalThis.ChoixPerso = ChoixPerso;
globalThis.PushOnClick = PushOnClick;

//////// Préréquis pour tester la classe Menu ////////
// Pour tester la classe Menu il vous faudra :
// -Aller dans le fichier staticFiles\game\src\scenes\Menu.js
// -Et décomenter la ligne hors de la classe qui est module.exports = Menu;
// Car il y'a des problèmes d'exportation entre le framework phaser et jest
/////////////////////////////////////////////////////////

describe('Menu', () => {
  let menu;

  beforeEach(() => {
    const optionSceneMock = {
      vitesse: 0,
      son: true,
    };

    // On crée une instance de la classe Menu
    menu = new Menu({ key: 'Menu' });
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: {
        key: 'Menu',
        create: () => {},
        update: () => {},
      }

    });
    // mock des méthodes utilisées dans editorCreate()
    menu.add = {
      tileSprite: jest.fn(() => ({
        setOrigin: jest.fn(),
      })),
      image: jest.fn(() => ({
        scaleX: jest.fn(),
        scaleY: jest.fn(),
      })),
      sprite: jest.fn(() => ({
        scaleX: jest.fn(),
        scaleY: jest.fn(),
        play: jest.fn(),
      })),
    };
    menu.game = {
      scene: {
        getScene: jest.fn(() => optionSceneMock),
      },
    };
    menu.fond = {
      setOrigin: jest.fn(),
      tilePositionX: jest.fn(),
    };
    menu.scene = {
      launch: jest.fn(),
      bringToTop: jest.fn(),
    };

    Phaser.Display.Align.In.Center = jest.fn();

    

  });

  it('On regarde si non éléments sont bien crée avec ce qui et attendue', () => {
    menu.editorCreate();
    // On vérifie que la méthode add.tileSprite a été appelée avec les bons paramètres
    expect(menu.add.tileSprite).toHaveBeenCalledWith(0, 0, 1200, 672, 'background');

    // On vérifie que la méthode add.image a été appelée avec les bons paramètres
    expect(menu.add.image).toHaveBeenCalledWith(0, 0, 'logo');

    // On vérifie que la méthode add.sprite a été appelée avec les bons paramètres
    expect(menu.add.sprite).toHaveBeenCalledWith(59, 405, 'idleF', 0);

    // On vérifie que la méthode add.image a été appelée avec les bons paramètres
    expect(menu.add.image).toHaveBeenCalledWith(950, 70, 'engrenage');

    // On vérifie que la méthode add.image a été appelée avec les bons paramètres
    expect(menu.add.image).toHaveBeenCalledWith(500, 550, 'start');

  });

  it('On demarre la scene quand on appuye sur l\'engrenage', () => {
    menu.editorCreate();
    menu.engrenage.emit('pointerdown');
    expect(menu.scene.launch).toHaveBeenCalledWith('Option');
  });

  it('On demarre la scene quand on appuye sur le bouton start', () => {
    menu.editorCreate();
    menu.start.emit('pointerdown');
    expect(ChoixMode).toHaveBeenCalled();
  });

 
  
  
  

});
