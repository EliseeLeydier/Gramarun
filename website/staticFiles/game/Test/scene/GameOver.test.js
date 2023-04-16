const Phaser = require('phaser');
const GameOver = require('../../src/scenes/GameOver.js');
const PushOnClick = jest.fn();
globalThis.PushOnClick = PushOnClick;

//////// Préréquis pour tester la classe GameOver ////////
// Pour tester la classe Level il vous faudra :
// -Aller dans le fichier staticFiles\game\src\scenes\GameOver.js
// -Et décomenter la ligne hors de la classe qui est module.exports = GameOver;
// Car il y'a des problèmes d'exportation entre le framework phaser et jest
//puis quand vous aurez fini de tester la classe GameOver, remettre la ligne en commentaire pour que le jeu fonctionne
/////////////////////////////////////////////////////////
describe("GameOver", () => {
    let scene;
    let gameover;

    beforeEach(() => {
        const optionSceneMock = {
            vitesse: 0,
            son: true,
        };

        // On crée une instance de la classe Menu
        gameover = new GameOver({ key: 'GameOver' });
        game = new Phaser.Game({
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            scene: [GameOver],
          });
        // mock des méthodes utilisées dans editorCreate()
        gameover.add = {
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
                setStyle: jest.fn(),
            })),
        };

        gameover.game = {
            scene: {
                getScene: jest.fn(() => optionSceneMock),
            },
        };
        gameover.fond = {
            setOrigin: jest.fn(),
            tilePositionX: jest.fn(),
        };
        gameover.scene = {
            launch: jest.fn(),
            bringToTop: jest.fn(),
        };
        fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({
                scoreLePlusHaut: 0,
            }),
        }));
  
 

        Phaser.Display.Align.In.Center = jest.fn();



    });


    test("On vérifie que tout les élément sont bien crée", () => {
        gameover.editorCreate();
        //on vérifie que le bouton retry est bien crée
        expect(gameover.add.image).toHaveBeenCalledWith(0, 0, "retryButton");
        //on vérifie que le score text est bien crée
        expect(gameover.add.text).toHaveBeenCalledWith(150, 100, "Score : 0/undefined");
    });

    test("On vérifie que le score est bien affiché", () => {
        // le test ne passe pas car getByName ne fonctionne pas
        gameover.questionRecap = [["Question 1", "Question 2"], 1];
        gameover.editorCreate();
        const scoreText = gameover.children.getByName("Score");
        expect(scoreText.text).toBe("Score : 1/2");
    });

    test("On vérifie que le score est bien envoyé au serveur", () => {
        gameover.questionRecap = [["Question 1", "Question 2"], 1];
        gameover.editorCreate();
        expect(fetch).toHaveBeenCalledWith('/recupererScore', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({scoreLePlusHaut: 50 })
          });
    });

    test("on teste si le bouton retry fonctionne", () => {
        // le test ne passe pas car getByName ne fonctionne pas
        gameover.editorCreate();
        const retryButton = gameover.children.getByName("retryButton");
        retryButton.emit("pointerdown");
        expect(gameover.scene.launch).toHaveBeenCalledWith("Menu");
        expect(gameover.scene.bringToTop).toHaveBeenCalledWith("Menu");
    });
});
