from flask import Flask, jsonify
import subprocess
import os

app = Flask(__name__)

# Path to your scripts (adjust according to your folder structure)
PUBLISHER_SCRIPT = os.path.join(os.path.dirname(__file__), 'publisher.py')
SUBSCRIBER_SCRIPT = os.path.join(os.path.dirname(__file__), 'subscriber.py')

# Endpoint to start publisher.py
@app.route('/start-publisher', methods=['GET'])
def start_publisher():
    try:
        subprocess.Popen(['python', PUBLISHER_SCRIPT], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return jsonify({'status': 'Publisher started'}), 200
    except Exception as e:
        return jsonify({'status': 'Error starting publisher', 'error': str(e)}), 500

# Endpoint to start subscriber.py
@app.route('/start-subscriber', methods=['GET'])
def start_subscriber():
    try:
        subprocess.Popen(['python', SUBSCRIBER_SCRIPT], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return jsonify({'status': 'Subscriber started'}), 200
    except Exception as e:
        return jsonify({'status': 'Error starting subscriber', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
