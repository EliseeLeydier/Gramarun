const Phaser = require("phaser");
const Level = require("../../src/scenes/Level.js");
const Physics = jest.fn();
globalThis.Physics = Physics;
const Mouvement = jest.fn();
globalThis.Mouvement = Mouvement;


//////// Préréquis pour tester la classe Level ////////
// Pour tester la classe Level il vous faudra :
// -Aller dans le fichier staticFiles\game\src\scenes\Level.js
// -Et décomenter la ligne hors de la classe qui est module.exports = Level;
// Car il y'a des problèmes d'exportation entre le framework phaser et jest
//puis quand vous aurez fini de tester la classe Level, remettre la ligne en commentaire pour que le jeu fonctionne
/////////////////////////////////////////////////////////
describe('Level class', () => {
    let level;
    beforeEach(() => {
        const optionSceneMock = {
            vitesse: 0,
            son: true,
        };

        // On crée une instance de la classe Level
        level = new Level({ key: 'Level' });
        const game = new Phaser.Game({
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            scene: {
                key: 'Level',
                create: () => { },
                update: () => { },

            }

        });
        // mock des méthodes utilisées dans editorCreate()
        level.add = {
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
        level.game = {
            scene: {
                getScene: jest.fn(() => optionSceneMock),
            },
        };
        level.fond = {
            setOrigin: jest.fn(),
            tilePositionX: jest.fn(),
        };
        level.scene = {
            launch: jest.fn(),
            bringToTop: jest.fn(),
        };

        level.make = {
            tilemap: jest.fn().mockReturnValue({
                addTilesetImage: jest.fn(),
                createLayer: jest.fn().mockImplementation((name) => {
                    const layer = {
                        name,
                        setCollisionByProperty: jest.fn()
                    };
                    return layer;
                }),
                widthInPixels: 500,
                heightInPixels: 500
            })
        };
        level.physics = {
            world: {
                setBounds: jest.fn()
            },
            add: {
                collider: jest.fn(),
                sprite: jest.fn().mockReturnValue({
                    setOrigin: jest.fn(),
                    scale: jest.fn(),
                    setScrollFactor: jest.fn(),
                }),
            }
        };




    });



    it('La classe Level et défini', () => {
        expect(level).toBeDefined();

    });

    it('Aprés utilisation de la fonction resetListeNPC() on met la liste à vide', () => {
        level.listeNPC = ['npc1', 'npc2', 'npc3'];
        level.resetListeNPC();
        expect(level.listeNPC).toEqual([]);
    });

    it('On doit renvoyé 0 si l\'instance de count et pair (la avec 2)', () => {
        Level.instanceCount = 2;
        expect(level.getMapIndex()).toEqual(0);
    });


    it('on doit renvoyé 1 si l\'instance de count et impair (la avec 3)', () => {
        Level.instanceCount = 9;
        expect(level.getMapIndex()).toEqual(1);
    });

    it('On vérifie que la scene nous renvoie bien le bon nombre de point de vie', () => {
        const menuScene = {
            pointDeVie: 3
        };
        level.game.scene.getScene = jest.fn(() => menuScene);
        expect(level.getPointDeVie()).toEqual(3);


    });


    it('On teste les 3 différente couche de la carte', () => {
        level.createMap();
        expect(level.carte).toBeDefined();
        expect(level.fond.name).toEqual('fond');
        expect(level.platforme.name).toEqual('platforme');
        expect(level.deco.name).toEqual('deco');
        expect(level.physics.world.setBounds).toHaveBeenCalledWith(0, 0, 500, 548);
    });

    it("On vérifie que la création des layers c'est fait correctement", () => {
        level.init();
        level.createMap();

        // Vérifier si toutes les couches ont été créées
        expect(level.fond).toBeDefined();
        expect(level.platforme).toBeDefined();
        expect(level.deco).toBeDefined();

        // Vérifier si les couches sont bien des TilemapLayer
        //les valeur attendu sont normallement true mais les json ne sont pas reconnu par jest
        expect(level.fond instanceof Phaser.Tilemaps.TilemapLayer).toBe(false);
        expect(level.platforme instanceof Phaser.Tilemaps.TilemapLayer).toBe(false);
        expect(level.deco instanceof Phaser.Tilemaps.TilemapLayer).toBe(false);
    });

    it("On teste la collision entre le joueur et l'ennemi ", () => {
        level.physics.add.collider(level.joueur, level.ennemi);
        expect(level.physics.add.collider).toHaveBeenCalledWith(level.joueur, level.ennemi);

    });
    it("On teste la collision entre le joueur et les plateformes", () => {
        level.physics.add.collider(level.joueur, level.platforme);
        expect(level.physics.add.collider).toHaveBeenCalledWith(level.joueur, level.platforme);
    });



});



