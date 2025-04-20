from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config
from models import db
from flask_bcrypt import Bcrypt
from routes.user import user_bp
from routes.pets import pet_bp
from routes.customer import customer_bp
from routes.appointments import appointment_bp
from routes.dashboard import dashboard_bp
import logging

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Thiết lập logging chi tiết
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    app.logger.setLevel(logging.DEBUG)
    
    # Cấu hình CORS đơn giản hơn để cho phép mọi kết nối
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
    
    # Initialize extensions
    db.init_app(app)
    bcrypt = Bcrypt(app)
    
    # Register blueprints
    app.register_blueprint(user_bp)
    app.register_blueprint(customer_bp)
    app.register_blueprint(pet_bp)
    app.register_blueprint(appointment_bp)
    app.register_blueprint(dashboard_bp)
    
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = app.make_default_options_response()
            response.headers.add('Access-Control-Allow-Origin', '*')
            response.headers.add('Access-Control-Allow-Headers', '*')
            response.headers.add('Access-Control-Allow-Methods', '*')
            return response

    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"message": "Route not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        app.logger.error(f"Server error: {str(e)}")
        return jsonify({"message": "Internal server error", "error": str(e)}), 500

    return app

# Thiết lập logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = create_app()

if __name__ == "__main__":
    logger.info("Starting server...")
    app.run(debug=True)