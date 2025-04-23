from flask import Flask, request, jsonify
from flask_cors import CORS
from instagrapi import Client
from instagrapi.exceptions import LoginRequired
import time

app = Flask(__name__)
CORS(app)  # Enable CORS

app.secret_key = "your-random-secret-key"  # Change this!

def get_non_followers(username, password):
    cl = Client()
    try:
        cl.login(username, password)
        user_id = cl.user_id_from_username(username)
        
        followers = {user.username for user in cl.user_followers(user_id).values()}
        following = {user.username for user in cl.user_following(user_id).values()}
        
        return following - followers
    except Exception as e:
        raise Exception(f"Instagram error: {e}")
    finally:
        cl.logout()

@app.route('/check_non_followers', methods=['POST'])
def check_non_followers():
    try:
        data = request.json
        result = get_non_followers(data['username'], data['password'])
        return jsonify({
            'success': True,
            'count': len(result),
            'non_followers': list(result),
            'filename': f"non_followers_{time.strftime('%Y%m%d-%H%M%S')}.txt"
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
