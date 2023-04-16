from flask import Blueprint, render_template, request, flash
from .. import db
from ..models import Question
from flask_login import login_required, current_user

default = Blueprint("default", __name__)

#Page d'accueil
@default.route("/")
def accueil():
    return render_template("home.html",user=current_user)

#Page de jeu
@default.route("/game")
@login_required
def jeu():
    #Récupère les questions de la base de données
    question = ""
    answer1 = ""
    answer2 = ""
    answer3 = ""
    answer4 = ""
    allScore = Question.query.all()
    #Crée une liste de questions sous forme de string
    for item in allScore:
        question += str(item)[10:len(str(item))-1]+","
        answer1 += str(item.answer1)+","
        answer2 += str(item.answer2)+","
        answer3 += str(item.answer3)+","
        answer4 += str(item.answer4)+","
    print(question)
    return render_template("game.html", name=current_user.username, user=current_user, question=question, answer1=answer1, answer2=answer2, answer3=answer3, answer4=answer4)

@default.route("/tutorial")
def tutorial():
    return render_template("tutorial.html", user=current_user)
