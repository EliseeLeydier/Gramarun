class GameOver extends Phaser.Scene {

    init(data) {

        this.questionRecap = this.game.scene.getScene('Menu').questionRecap;
        this.APerdu = data.APerdu;

    } // Fin constructor()

    /** @returns {void} */
    editorCreate() {

		// fond en fonction du personnage selectionnee et de si le joueur a gagne ou perdu
        var fond;
        if(this.game.scene.getScene('Menu').intPerso == 1){
            if(this.APerdu){
                fond = this.add.image(this.game.scale.width/2, this.game.scale.height/2, "gameOverLostF");
            }else{
                fond = this.add.image(this.game.scale.width/2, this.game.scale.height/2, "gameOverWinF");
            } // Fin if else

        }else{
            if(this.APerdu){
                fond = this.add.image(this.game.scale.width/2, this.game.scale.height/2, "gameOverLostM");
            }else{
                fond = this.add.image(this.game.scale?.width/2, this.game.scale?.height/2, "gameOverWinM");
            } // Fin if else
            
        } // Fin if else


        // bouton pour recommencer
        const retryButton = this.add.image(0, 0, "retryButton");
        new PushOnClick(retryButton);
        Phaser.Display.Align.In.Center(retryButton, fond, 300, 50);
        retryButton.scaleX = 1.25;
        retryButton.scaleY = 1.25;
        
        // si le joueur n'a pas repondu a aucune question, le score est 0/0 si non on affiche et renvoie a la BD le score
        if(this.questionRecap == undefined){
            var texte = "Score : 0/"+ (this.questionRecap?.[0].length);

        } else {
            var texte = "Score : " + this.questionRecap[1] + "/" +(this.questionRecap[0].length);

            // calcul du score en pourcentage
            var scorePourcentage = parseInt(this.questionRecap[1]/this.questionRecap[0].length * 100);
            // envoi du score au serveur
            fetch('/recupererScore', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({scoreLePlusHaut: scorePourcentage })
              })
                .then(response => response.json())

        } // Fin else if

        // affichage du score
        const score = this.add.text(150, 100, texte);
        this.texte = texte
        score.setStyle({ "fontSize": "30px" });
        Phaser.Display.Align.In.Center(score, fond, 300, 125);

        retryButton.setInteractive?.({ useHandCursor: true }).on("pointerdown", () => {
            //this.scene.stop("Level");
            this.scene.start('Menu');
            this.scene.stop("GameOver");
		});

        this.events?.emit("scene-awake");
    } // Fin editorCreate()

    create() {
        const synth = window.speechSynthesis;
        synth.cancel();

        this.editorCreate();


        if(this.game.scene.getScene('Option').son){
            // Écouter l'événement voiceschanged pour récupérer les voix disponibles
            synth.addEventListener('voiceschanged', () => {
                const voices = synth.getVoices();

                // Créer une instance d'un objet de synthèse vocale
                const utterance = new SpeechSynthesisUtterance("game over");

                // Sélectionner une voix en anglais
                const englishVoice = voices.find((voice) => voice.lang.includes("en"));
                utterance.voice = englishVoice;

                // Lancer la synthèse vocale
                synth.speak(utterance);
            });
            // Vérifier si les voix sont déjà disponibles
            if (synth.getVoices().length !== 0) {
                const voices = synth.getVoices();

                // Créer une instance d'un objet de synthèse vocale
                const utterance = new SpeechSynthesisUtterance("game over");

                // Sélectionner une voix en anglais
                const englishVoice = voices.find((voice) => voice.lang.includes("en"));
                utterance.voice = englishVoice;

                // Lancer la synthèse vocale
                synth.speak(utterance);
            }
        }
        
    } // Fin create()

} // Fin class GameOver

////////// A décomenter pour les tests //////////
//module.exports = GameOver;
////////////////////////////////////////////////