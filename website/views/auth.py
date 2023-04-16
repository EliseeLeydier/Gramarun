import os
import re
import requests
from dotenv import load_dotenv
from flask import Blueprint, current_app, render_template, redirect, url_for, request, flash
from itsdangerous import Serializer
from .. import db
from ..models import User
from flask_login import login_user, logout_user, login_required, current_user
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint("auth", __name__)

load_dotenv()
MAIL_SERVER = os.environ.get('MAIL_SERVER')
MAIL_PORT = os.environ.get('MAIL_PORT')
MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
SITE_KEY = os.environ.get('SITE_KEY')
SECRET_KEY = os.environ.get('SECRET_KEY')

#Permet de se connecter
@auth.route("/login", methods=['GET', 'POST'])
def login():
    #Récupère les données du formulaire
    if request.method == 'POST':
        recaptcha_response = request.form.get('g-recaptcha-response')
        secret_key = SECRET_KEY

        # Vérifie si le reCAPTCHA est valide
        recaptcha_check = requests.post('https://www.google.com/recaptcha/api/siteverify', data={'secret': secret_key, 'response': recaptcha_response})
        recaptcha_result = recaptcha_check.json()

        print(recaptcha_result)

        if not recaptcha_result['success']:
            flash('Invalid reCAPTCHA. Please try again.', category='error')
            return redirect(url_for('default.login'))

        email = request.form.get("email")
        motDePasse = request.form.get("password")

        #Vérifie si l'utilisateur existe
        utilisateur = User.query.filter_by(email=email).first()
        if utilisateur:
            #Vérifie si le mot de passe est correct en le déchiffrant
            if check_password_hash(utilisateur.password, motDePasse):
                flash("You are connected!", category='success')
                login_user(utilisateur, remember=True)
                return redirect(url_for('default.accueil'))
            else:
                flash('The password doesn\'t match, if you lost it contact an administrator', category='error')
        else:
            flash('No such account exists...', category='error')
    return render_template("login.html", user=current_user, site_key=SITE_KEY)

#Permet la création d'un compte
@auth.route("/sign-up", methods=['GET', 'POST'])
def sign_up():
    #Récupère les données du formulaire
    if request.method == 'POST':
        email = request.form.get("email")
        pseudo = request.form.get("username")
        motDePasse1 = request.form.get("password1")
        emailExiste = User.query.filter_by(email=email).first()
        pseudoExiste = User.query.filter_by(username=pseudo).first()
        password_pattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"

        #Condition de création d'un compte
        if emailExiste:
            flash('There is already an account using this e-mail.', category='error')
        elif pseudoExiste:
            flash('There is already an account using this username.', category='error')
        elif len(pseudo) < 2:
            flash('Username is too short.', category='error')
        elif len(pseudo) > 15:
            flash('Username is too long, max 15 characters please.', category='error')
        elif len(email) < 4:
            flash("Have you typed the your email correctly ?.", category='error')
        elif re.match(password_pattern, motDePasse1) == None:
            flash('Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character.', category='error')
        #Création du compte
        else:
            nouvelUtilisateur = User(email=email, username=pseudo, password=generate_password_hash(
                motDePasse1, method='sha256'))
            db.session.add(nouvelUtilisateur)
            db.session.commit()
            login_user(nouvelUtilisateur, remember=True)
            flash('Account created correctly!', category='success')
            return redirect(url_for('default.accueil'))

    return render_template("signup.html", user=current_user)


#Permet de changer le mot de passe
@auth.route("/passReset", methods=['GET', 'POST'])
def pass_reset():
    if request.method == 'POST':
        email = request.form.get('email')
        user = User.query.filter_by(email=email).first()
        if user:
            # Genère un token pour la réinitialisation du mot de passe
            token = user.get_reset_token()
            # Envoie un mail avec le token
            send_password_reset_email(user, token)
            flash('An email has been sent with instructions to reset your password.', category='success')
            return redirect(url_for('auth.login'))
        else:
            flash('No account with that email exists.', category='error')
    return render_template('passForget.html', user=current_user)

#Permet d'envoyer un mail pour réinitialiser le mot de passe
def send_password_reset_email(user,token):
    mail = Mail()
    current_app.config['MAIL_SERVER']= MAIL_SERVER
    current_app.config['MAIL_PORT'] = MAIL_PORT
    current_app.config['MAIL_USERNAME'] = MAIL_USERNAME
    current_app.config['MAIL_PASSWORD'] = MAIL_PASSWORD
    current_app.config['MAIL_USE_TLS'] = False
    current_app.config['MAIL_USE_SSL'] = True
    mail.init_app(current_app)

    msg = Message('Password Reset Request',
                  sender='gramarun@alwaysdata.net',
                  recipients=[user.email])
    msg.body = f'''To reset your password, visit the following link:
    {url_for('auth.reset_password', token=token, _external=True)}
    If you did not make this request then simply ignore this email and no changes will be made.
    '''
    mail.send(msg)

@auth.route("/reset_password/<token>", methods=['GET', 'POST'])
def reset_password(token):
    if current_user.is_authenticated:
        return redirect(url_for('default.accueil'))
    user = User.verify_reset_token(token)
    if user is None:
        flash('That is an invalid or expired token', category='error')
        return redirect(url_for('auth.pass_reset'))
    if request.method == 'POST':
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        if len(password) < 6:
            flash('Password not enough secure.', category='error')
        elif password != confirm_password:
            flash('Passwords don\'t match.', category='error')
        else:
            user.password = generate_password_hash(password, method='sha256')
            db.session.commit()
            flash('Your password has been updated! You are now able to log in', category='success')
            return redirect(url_for('auth.login'))
    return render_template('resetPassword.html', user=current_user)

#Permet de se déconnecter
@auth.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("default.accueil"))
