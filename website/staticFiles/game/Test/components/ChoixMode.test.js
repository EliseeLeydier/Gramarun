const ChoixMode = require('../../src/components/ChoixMode');
const Phaser = require('phaser');
const { Scene } = require('phaser');
const PushOnClick = jest.fn();
globalThis.PushOnClick = PushOnClick;



describe('ChoixMode', () => {
    // On crée un objet "mock" pour simuler la scène car les tests ne sont pas exécutés dans le navigateur.
    //Et ne sont donc pas reconnu par Jest.
    const optionSceneMock = {
        vitesse: 0,
        son: true,
      };
    const mockText = {
        setScrollFactor: jest.fn(() => mockText),
    };
    const mockImage = {
        setScrollFactor: jest.fn(() => mockImage),
        scaleX: 1.3,
        scaleY: 1.3,
        visible: false
    };
    const mockSprite = {
        setScrollFactor: jest.fn(() => mockText),


    };
    const scene = {
        add: {
            image: jest.fn(() => mockImage),
            sprite: jest.fn(() => mockSprite),
            text: jest.fn(() => mockText),
        },
        physics: {
            add: {
                sprite: jest.fn(() => mockSprite),
            },

        },
        game: {

            scale: {
                width: 800,
                height: 600,
            },

            scene: {
                getScene: jest.fn(() => optionSceneMock),
            },

        },
        
    };
      
    // On crée une instance de la classe ChoixMode
    const choixMode = new ChoixMode(scene, 1);

    it('On vérifie que tout les élèment sont bien crée', () => {
        // On vérifie que les méthodes add.image et add.text ont été appelées avec les bons paramètres
        expect(scene.add.image).toHaveBeenCalledWith(400, 300, 'feuille');
        // On vérifie que les méthodes add.image et add.text ont été appelées avec les bons paramètres
        expect(scene.add.text).toHaveBeenCalledWith(0, 0, 'Mode selection : ', { font: '45px Helvetica bold', fill: '#006bac' });
        // On vérifie que les méthodes add.image et add.text ont été appelées avec les bons paramètres
        expect(scene.physics.add.sprite).toHaveBeenCalledWith(0, 0, 'normalMode', 0);
        // On vérifie que les méthodes add.image et add.text ont été appelées avec les bons paramètres
        expect(scene.physics.add.sprite).toHaveBeenCalledWith(0, 0, 'qcmMode', 0);
        //on vérifie les état de visibilité
        expect(choixMode.feuille.visible).toBe(false);
        expect(choixMode.choixTexte.visible).toBe(false);
        expect(choixMode.choix1.visible).toBe(false);
        expect(choixMode.choix2.visible).toBe(false);
        // On vérifie que les méthodes setScrollFactor ont été appelées avec les bons paramètres
        expect(mockImage.setScrollFactor).toHaveBeenCalledWith(0);
        expect(mockText.setScrollFactor).toHaveBeenCalledWith(0);
    });

    it('on test la méthode runChoixMode', () => {
        choixMode.runChoixPerso();
        expect(choixMode.feuille.visible).toBe(true);
        expect(choixMode.choixTexte.visible).toBe(true);
        expect(choixMode.choix1.visible).toBe(true);
        expect(choixMode.choix2.visible).toBe(true);
    });


});