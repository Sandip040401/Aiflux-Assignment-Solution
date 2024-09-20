import app from './config/serverConfig';
import { runPythonFile } from './utils/runPython';
import './services/mqttSubscriber';

// Run Python scripts
runPythonFile('subscriber.py');
runPythonFile('publisher.py');
