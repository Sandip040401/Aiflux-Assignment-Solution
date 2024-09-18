from flask import Flask, jsonify
import subprocess
import os
import sys

app = Flask(__name__)

# Get the path to the correct Python executable (this works across different platforms)
PYTHON_EXECUTABLE = sys.executable

# Path to your scripts (adjust according to your folder structure)
PUBLISHER_SCRIPT = os.path.join(os.path.dirname(__file__), 'publisher.py')
SUBSCRIBER_SCRIPT = os.path.join(os.path.dirname(__file__), 'subscriber.py')

# Function to start a script with better logging
def start_script(script_path):
    try:
        process = subprocess.Popen([PYTHON_EXECUTABLE, script_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return process
    except Exception as e:
        raise RuntimeError(f"Failed to start script {script_path}: {str(e)}")

# Endpoint to start publisher.py
@app.route('/start-publisher', methods=['GET'])
def start_publisher():
    try:
        start_script(PUBLISHER_SCRIPT)
        return jsonify({'status': 'Publisher started'}), 200
    except Exception as e:
        return jsonify({'status': 'Error starting publisher', 'error': str(e)}), 500

# Endpoint to start subscriber.py
@app.route('/start-subscriber', methods=['GET'])
def start_subscriber():
    try:
        start_script(SUBSCRIBER_SCRIPT)
        return jsonify({'status': 'Subscriber started'}), 200
    except Exception as e:
        return jsonify({'status': 'Error starting subscriber', 'error': str(e)}), 500

# Start the Flask server
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # Default to port 5000 if PORT environment variable is not set
    app.run(host='0.0.0.0', port=port)
