from flask import Flask
import auth
import routes

app = Flask(__name__)

app.config.from_mapping(
        # a default secret that should be overridden by instance config
        SECRET_KEY="aajuyfgkargargyerghaiolhgfkiareuhgliauerhgoiauhgoliudztrgholsiutrhgsiuhtgiud",
    )

app.register_blueprint(auth.bp)
app.register_blueprint(routes.bp)

app.add_url_rule("/", endpoint="home")

if __name__ == '__main__':
    app.run(debug=True)
