class Question extends Phaser.Scene {
  VERT = "#2ECC71";
  MARRON = "#689ecb";
  GRIS = "#006bac";
  ROUGE = "#ff5d5d";

  init() {
    this.questionRecap = this.game.scene.getScene("Menu").questionRecap; // Tableau recapitulatif des questions
  } // Fin init()

  gestionQuestion() {
    // On récupère les données de la question            // Liaison avec la base de donnée
    const element = document.getElementById("tableauDonnees");
    const tabQuestion = element.dataset.question.split(",");
    const tabAnswer1 = element.dataset.answer1.split(",");
    const tabAnswer2 = element.dataset.answer2.split(",");
    const tabAnswer3 = element.dataset.answer3.split(",");
    const tabAnswer4 = element.dataset.answer4.split(",");
    var listeReponse = [tabAnswer1, tabAnswer2, tabAnswer3, tabAnswer4];
    this.tabQuestion = tabQuestion; // Question
    this.listeReponse = listeReponse; // Bonne réponse

    //Si on a parcourus toute les question, ou qu'on a fait 10 question, on a gagné
    if (
      tabQuestion.length - this.questionRecap[0].length - 2 == 0 ||
      this.questionRecap[0].length == 10
    ) {
      const synth = window.speechSynthesis;
      synth.cancel();

      this.scene.stop("Question.js");
      this.scene.start("GameOver", { APerdu: false });
      return; //Pour pas qu'il rajoute une autre question dans le tableau recapitulatif
    } // Fin if

    // Choix de la question en aléatoire par rapport a toute celle qui reste
    var aleatoireQuestion = this.getRandomInt(
      0,
      tabAnswer1.length - 2,
      this.questionRecap[0]
    );
    // On rajoute l'id de la question dans le tableau recapitulatif

    this.game.scene.getScene("Menu").questionRecap[0].push(aleatoireQuestion);
    this.aleatoireQuestion = aleatoireQuestion;
  } // Fin gestionQuestion()

  //en OU fr
  lisLeMot(mot, langue) {
    const synth = window.speechSynthesis;
    // Écouter l'événement voiceschanged pour récupérer les voix disponibles
    synth.addEventListener("voiceschanged", () => {
      const voices = synth.getVoices();

      // Créer une instance d'un objet de synthèse vocale
      const utterance = new SpeechSynthesisUtterance(mot);

      // Sélectionner une voix en anglais
      const englishVoice = voices.find((voice) => voice.lang.includes(langue));
      utterance.voice = englishVoice;

      // Lancer la synthèse vocale
      synth.speak(utterance);
    });
    // Vérifier si les voix sont déjà disponibles
    if (synth.getVoices().length !== 0) {
      const voices = synth.getVoices();

      // Créer une instance d'un objet de synthèse vocale
      const utterance = new SpeechSynthesisUtterance(mot);

      // Sélectionner une voix en anglais
      const englishVoice = voices.find((voice) => voice.lang.includes(langue));
      utterance.voice = englishVoice;

      // Lancer la synthèse vocale
      synth.speak(utterance);
    }
  } // Fin lisLeMot()

  separerLaPhrase(phrase, reponse1, reponse2, reponse3, reponse4) {
    var langueReponse = "en";
    if (phrase.includes("French")) {
      this.lisLeMot(phrase, "en");
      langueReponse = "fr";
    } else if (phrase.includes("English")) {
      var txt1 = "";
      var textChangement = "";
      for (var i = 1; i < phrase.length; i++) {
        txt1 += phrase[i - 1];
        if (phrase[i - 1] == '"') {
          txt1 = txt1.substr(0, txt1.length - 1);
          var j = i;
          while (phrase[j] != '"') {
            textChangement += phrase[j];
            j += 1;
          }
          break;
        }
      }
      this.lisLeMot(txt1, "en");
      this.lisLeMot(textChangement, "fr");
    } else {
      this.lisLeMot(phrase, "en");
    }
    this.lisLeMot("first answer : ", "en");
    this.lisLeMot(reponse1, langueReponse);
    this.lisLeMot("Second answer : ", "en");
    this.lisLeMot(reponse2, langueReponse);
    this.lisLeMot("Third answer : ", "en");
    this.lisLeMot(reponse3, langueReponse);
    this.lisLeMot("Fourth answer : ", "en");
    this.lisLeMot(reponse4, langueReponse);
  } // Fin separerLaPhrase()

  /** @returns {void}*/
  editorCreate() {

    if (this.game.scene.getScene('Menu').intPerso == 0) {
      const fond = this.add
        .image(
          this.scene.scene.scale.width / 2,
          this.scene.scene.scale.height / 2,
          "backgroundNormalMode"
        )
        .setScrollFactor(0);
    }
    // feuilleQuestion
    const feuilleQuestion = this.add
      .image(
        this.scene.scene.scale.width / 2,
        this.scene.scene.scale.height / 2,
        "feuille"
      )
      .setScrollFactor(0);
    feuilleQuestion.scaleX = 1.25;

    // txtQuestion
    const txtQuestion = this.add
      .text(0, 0, this.tabQuestion[this.aleatoireQuestion], {
        font: "32px Helvetica bold",
        fill: this.MARRON,
        wordWrap: { width: 650 },
      })
      .setScrollFactor(0);
    const valider = this.scene.scene.add
      .image(0, 0, "valider")
      .setScrollFactor(0);
    valider.scaleX = 0.1;
    valider.scaleY = 0.1;
    valider.visible = false;
    new PushOnClick(valider);

    //Aligner feuille et question
    Phaser.Display.Align.In.Center(valider, feuilleQuestion, 0, 110);

    //Aligner feuille et question
    Phaser.Display.Align.In.Center(txtQuestion, feuilleQuestion, 0, -110);

    // Texte "Right" & "False"
    const Aright = this.scene.scene.add
      .text(420, 225, "Right", { font: "50px Helvetica bold", fill: this.VERT })
      .setScrollFactor(0);
    const Afalse = this.scene.scene.add
      .text(420, 225, "Wrong", {
        font: "50px Helvetica bold",
        fill: this.ROUGE,
      })
      .setScrollFactor(0);
    Afalse.visible = false;
    Aright.visible = false;

    //Aligner feuille et question
    Phaser.Display.Align.In.Center(Aright, feuilleQuestion, 0, -50);
    Phaser.Display.Align.In.Center(Afalse, feuilleQuestion, 0, -50);

    // Groupe de bouton
    var groupeBoutton = this.add.group([
      {
        key: "qcm",
        frame: 0,
        repeat: 1,
        setXY: {
          x: this.scene.scene.scale.width / 2 - 150,
          y: this.scene.scene.scale.height / 2,
          stepX: 280,
          scrollFactorX: 0,
        },
      },
      {
        key: "qcm",
        frame: 0,
        repeat: 1,
        setXY: {
          x: this.scene.scene.scale.width / 2 - 150,
          y: this.scene.scene.scale.height / 2 + 50,
          stepX: 280,
        },
      },
    ]);

    var valeurExclus = [];
    var bonneReponse;

    // Groupe de texte de bouton
    var aleatoireReponse = this.getRandomInt(0, 3, valeurExclus);
    valeurExclus.push(aleatoireReponse);
    const Txtbutton1 = this.scene.scene.add
      .text(
        260,
        285,
        this.listeReponse[aleatoireReponse][this.aleatoireQuestion],
        { font: "30px Helvetica bold", fill: this.MARRON }
      )
      .setScrollFactor(0);
    if (aleatoireReponse == 0) {
      bonneReponse = 0;
    } // Fin if

    var aleatoireReponse = this.getRandomInt(0, 3, valeurExclus);
    valeurExclus.push(aleatoireReponse);
    const Txtbutton2 = this.scene.scene.add
      .text(
        512,
        285,
        this.listeReponse[aleatoireReponse][this.aleatoireQuestion],
        { font: "30px Helvetica bold", fill: this.MARRON }
      )
      .setScrollFactor(0);
    if (aleatoireReponse == 0) {
      bonneReponse = 1;
    } // Fin if

    var aleatoireReponse = this.getRandomInt(0, 3, valeurExclus);
    valeurExclus.push(aleatoireReponse);
    const Txtbutton3 = this.scene.scene.add
      .text(
        235,
        335,
        this.listeReponse[aleatoireReponse][this.aleatoireQuestion],
        { font: "30px Helvetica bold", fill: this.MARRON }
      )
      .setScrollFactor(0);
    if (aleatoireReponse == 0) {
      bonneReponse = 2;
    } // Fin if

    var aleatoireReponse = this.getRandomInt(0, 3, valeurExclus);
    valeurExclus.push(aleatoireReponse);
    const Txtbutton4 = this.scene.scene.add
      .text(
        552,
        335,
        this.listeReponse[aleatoireReponse][this.aleatoireQuestion],
        { font: "30px Helvetica bold", fill: this.MARRON }
      )
      .setScrollFactor(0);
    if (aleatoireReponse == 0) {
      bonneReponse = 3;
    } // Fin if

    this.bonneReponse = bonneReponse;

    var groupeTexte = this.add.group();
    groupeTexte.add(Txtbutton1);
    groupeTexte.add(Txtbutton2);
    groupeTexte.add(Txtbutton3);
    groupeTexte.add(Txtbutton4);

    if (this.game.scene.getScene("Option").son) {
      // Séparer et lit la phrase de la question dans la bonne langue
      this.separerLaPhrase(
        txtQuestion.text,
        Txtbutton1.text,
        Txtbutton2.text,
        Txtbutton3.text,
        Txtbutton4.text
      );
    }

    //Creer les enfant des groupes
    var enfantBoutton = groupeBoutton.getChildren();
    var enfantTxt = groupeTexte.getChildren();

    //Aligner les boutons et le text + push on click sur bouton
    for (var i = 0; i < enfantBoutton.length; i++) {
      new PushOnClick(enfantBoutton[i]);
      Phaser.Display.Align.In.Center(enfantTxt[i], enfantBoutton[i]);
    } // Fin for

    this.Aright = Aright;
    this.Afalse = Afalse;
    this.valider = valider;
    this.enfantBoutton = enfantBoutton;
    this.enfantTxt = enfantTxt;

    this.isSelectionnee = false;

    this.events.emit("scene-awake");
  } // Fin editorCreate()

  create() {
    this.gestionQuestion();
    this.editorCreate();
    this.event();
  } // Fin create()

  getRandomInt(min, max, excludedValues) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    if (excludedValues && excludedValues.includes(randomInt)) {
      return this.getRandomInt(min, max, excludedValues);
    }
    return randomInt;
  } // Fin getRandomInt()

  event() {
    this.valider.once(
      "pointerup",
      function (event) {
        const synth = window.speechSynthesis;
        synth.cancel();

        this.scene.stop("Question");
        this.scene.stop("Level");
        this.scene.start("Level", [this.pointDeViePerso]);
      },
      this
    );

    for (let i = 0; i < this.enfantBoutton.length; i++) {
      this.enfantBoutton[i].once(
        "pointerup",
        function (event) {
          if (this.isSelectionnee == false) {
            this.isSelectionnee = true;
            // Annule la lecture de la question
            const synth = window.speechSynthesis;
            synth.cancel();

            // Si le bouton est déjà sélectionné, on le déselectionne
            this.valider.visible = true;

            //  Si la bonne réponse est selectioné
            if (this.bonneReponse == i) {
              if (this.game.scene.getScene("Option").son) {
                // Séparer et lit la phrase de la question dans la bonne langue
                this.lisLeMot("Right", "en");
              }
              this.Aright.visible = true;
              this.Afalse.visible = false;
              this.game.scene.getScene("Menu").questionRecap[1] =
                parseInt(this.game.scene.getScene("Menu").questionRecap[1]) + 1;

              if (this.game.scene.getScene("Menu").vitesseEnnemi <= 80) {
                this.game.scene.getScene("Menu").vitesseEnnemi = 70;
              } else {
                this.game.scene.getScene("Menu").vitesseEnnemi -= 10;
              }
            } else {
              if (this.game.scene.getScene("Option").son) {
                // Séparer et lit la phrase de la question dans la bonne langue
                this.lisLeMot("wrong. The right answer was", "en");
                switch (this.bonneReponse) {
                  case 0:
                    this.lisLeMot("the first", "en");
                    break;
                  case 1:
                    this.lisLeMot("the second", "en");
                    break;
                  case 2:
                    this.lisLeMot("the third", "en");
                    break;
                  case 3:
                    this.lisLeMot("the fourth", "en");
                    break;
                }
              }
              this.Aright.visible = false;
              this.Afalse.visible = true;
              this.enfantTxt[i].setStyle({ color: this.ROUGE });
              this.game.scene.getScene("Menu").vitesseEnnemi += 20;
            }

            this.enfantTxt[this.bonneReponse].setStyle({ color: this.VERT });
          }
        },
        this
      );
    }
  } // Fin event()
} //Fin class
