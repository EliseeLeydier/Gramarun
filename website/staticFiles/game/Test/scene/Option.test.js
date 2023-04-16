const Phaser = require('phaser');
const Option = require('../../src/scenes/Option.js');
const ChoixMode = jest.fn();
const ChoixPerso = jest.fn();
const PushOnClick = jest.fn();
globalThis.ChoixMode = ChoixMode;
globalThis.ChoixPerso = ChoixPerso;
globalThis.PushOnClick = PushOnClick;

//////// Préréquis pour tester la classe Option ////////
// Pour tester la classe Option il vous faudra :
// -Aller dans le fichier staticFiles\game\src\scenes\option.js
// -Et décomenter la ligne hors de la classe qui est module.exports = Option;
// Car il y'a des problèmes d'exportation entre le framework phaser et jest
/////////////////////////////////////////////////////////

describe('Option', () => {
  let option;

  beforeEach(() => {
    const optionSceneMock = {
      vitesse: 0,
      son: true,
    };

    // On crée une instance de la classe option
    option = new Option({ key: 'option' });
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        },

      scene: {
        key: 'option',
        create: () => {},
        update: () => {},
      }

    });
    // mock des méthodes utilisées dans editorCreate()
    option.add = {
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
        text: jest.fn(() => ({
            setOrigin: jest.fn(),
            setStyle: jest.fn(),
        })),
    };
    option.game = {
      scene: {
        getScene: jest.fn(() => optionSceneMock),
      },
      scale: {
        width: 800,
        height: 600,
        },
    };
    option.fond = {
      setOrigin: jest.fn(),
      tilePositionX: jest.fn(),
    };
    option.scene = {
      launch: jest.fn(),
      bringToTop: jest.fn(),
    };
    option.sound = {
        add: jest.fn(() => ({
            play: jest.fn(),
        })),
    };



    Phaser.Display.Align.In.Center = jest.fn();

    

  });

    it('on vérifie que la classe Option est bien instanciée', () => {
    expect(option).toBeInstanceOf(Option);
    });

    it('on vérifie que tous les éléments sont bien crées', () => {
    option.editorCreate();

    //on vérifie que le fond est bien crée
    expect(option.add.image).toHaveBeenCalledWith(400,300, 'backgroundOption');

    //on vérifie que le bouton bas est bien crée
    expect(option.add.image).toHaveBeenCalledWith(0, 0, 'arrowDownButton');
    //on vérifie que le bouton haut est bien crée
    expect(option.add.image).toHaveBeenCalledWith(0, 0, 'arrowUpButton');
    //on vérifie que le bouton volumeOn est bien crée

    expect(option.add.image).toHaveBeenCalledWith(0, 0, 'volumeOn');

    //on vérifie que le bouton volumeOff est bien crée
    expect(option.add.image).toHaveBeenCalledWith(0, 0, 'volumeOff');

    //on vérifie que le bouton difficulté est bien crée
    expect(option.add.text).toHaveBeenCalledWith("", 0, 70);

    //on vérifie que le bouton classement est bien crée
    expect(option.add.image).toHaveBeenCalledWith(0, 0, 'leaderboardButton');
    
    });

    it("on teste la fonction setTextDifficulty", () => {
        option.game.scene.getScene('Menu').vitesseEnnemi = 70;
        expect(option.setTextDifficulty()).toBe("Normal");

        option.game.scene.getScene('Menu').vitesseEnnemi = 50;
        expect(option.setTextDifficulty()).toBe("Easy");

        option.game.scene.getScene('Menu').vitesseEnnemi = 90;
        expect(option.setTextDifficulty()).toBe("Hard");
      });

   


});