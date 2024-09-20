import { spawn } from 'child_process';
import path from 'path';

export const runPythonFile = (fileName: string) => {
  const pythonProcess = spawn('python3', [path.join(__dirname, '..', 'scripts', fileName)]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python script ${fileName} exited with code ${code}`);
  });
};
