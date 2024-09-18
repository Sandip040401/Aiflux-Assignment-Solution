from flask import Flask, jsonify
import subprocess
import os
import sys

app = Flask(__name__)

# Get the path to the correct Python executable
PYTHON_EXECUTABLE = sys.executable

# Paths to the publisher and subscriber scripts
PUBLISHER_SCRIPT = os.path.join(os.path.dirname(__file__), 'scripts', 'publisher.py')
SUBSCRIBER_SCRIPT = os.path.join(os.path.dirname(__file__), 'scripts', 'subscriber.py')

# Function to start the script
def start_script(script_path):
    try:
        process = subprocess.Popen([PYTHON_EXECUTABLE, script_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return process
    except Exception as e:
        raise RuntimeError(f"Failed to start script {script_path}: {str(e)}")

# Route to start publisher
@app.route('/start-publisher', methods=['GET'])
def start_publisher():
    try:
        start_script(PUBLISHER_SCRIPT)
        return jsonify({'status': 'Publisher started'}), 200
    except Exception as e:
        return jsonify({'status': 'Error starting publisher', 'error': str(e)}), 500

# Route to start subscriber
@app.route('/start-subscriber', methods=['GET'])
def start_subscriber():
    try:
        start_script(SUBSCRIBER_SCRIPT)
        return jsonify({'status': 'Subscriber started'}), 200
    except Exception as e:
        return jsonify({'status': 'Error starting subscriber', 'error': str(e)}), 500

# Start Flask server
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
