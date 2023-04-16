import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from sqlalchemy import create_engine
from dotenv import dotenv_values, load_dotenv
from flask_cors import CORS

#initialise la connexion à la base de données
db = SQLAlchemy()
load_dotenv()
DB_USER = os.environ.get('DB_USER')
DB_PASS = os.environ.get('DB_PASS')
DB_HOST = os.environ.get('DB_HOST')
DB_NAME = os.environ.get('DB_NAME')

moteur = create_engine(f"mysql+mysqlconnector://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}?charset=utf8mb4&collation=utf8mb4_general_ci", pool_recycle=3600)

def create_app():
    #initialise l'utilisation de flask
    app = Flask(__name__, template_folder='templates', static_folder='staticFiles')
    CORS(app, origins=["http://localhost:5000", "http://127.0.0.1:5000/", "https://gramarun.alwaysdata.net/"])
    app.config['SECRET_KEY'] = "helloworld"
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}?charset=utf8mb4&collation=utf8mb4_general_ci"
    db.init_app(app)

    #importe les fichiers de routes
    from .views.question import question
    from .views.default import default
    from .views.auth import auth
    from .views.leaderboard import tableLeaderboard

    #enregistre les routes
    app.register_blueprint(default, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")
    app.register_blueprint(tableLeaderboard, url_prefix="/")
    app.register_blueprint(question, url_prefix="/")

    app.config.update(SESSION_COOKIE_SECURE=True, SESSION_COOKIE_HTTPONLY=True, SESSION_COOKIE_SAMESITE='Lax')

    from .models import User

    #crée la base de données, enregistre les modifications dans la base de données
    with app.app_context():
        db.create_all()
        db.session.commit()

    #initialise le système de connexion
    gestionConnexion = LoginManager()
    gestionConnexion.login_view = "auth.login"
    gestionConnexion.init_app(app)

    @gestionConnexion.user_loader
    def load_user(id):
        return User.query.get(int(id))

    return app

