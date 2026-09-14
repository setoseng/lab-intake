from flask import Flask
from flask_cors import CORS

from db import get_db
from route import bp
from seed import seed


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(bp)
    seed(get_db())

    @app.get("/api/health")
    def health():
        return {"status": 200, "message": "ready"}

    return app


if __name__ == "__main__":
    create_app().run(port=4000, debug=True)
