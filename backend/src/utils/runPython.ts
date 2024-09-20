import { spawn } from 'child_process';
import path from 'path';

export const runPythonFile = (fileName: string) => {
  const pythonProcess = spawn('python3', ['--version']);

  pythonProcess.on('error', (error) => {
    console.error('Error occurred while checking Python:', error.message);
    console.error('Please ensure that Python is installed and added to your system PATH.');
  });

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python version: ${data.toString()}`);

    // If Python is found, then execute the Python script
    const scriptProcess = spawn('python3', [path.join(__dirname, '..', 'scripts', fileName)]);

    scriptProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    scriptProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    scriptProcess.on('close', (code) => {
      console.log(`Python script ${fileName} exited with code ${code}`);
    });
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });
};
