//Forcasting Engine
const { spawn } = require('child_process');
const path = require('path');

class ForecastingEngine {
    /**
     *
     * @param {Array} historyArray 
     */
    static runPredictionModel(historyArray) {
        return new Promise((resolve, reject) => {
            const scriptLocation = path.join(__dirname, '../../ai_engine/forecast.py');
            const payloadString = JSON.stringify({ history: historyArray });

            // Execute system child process 'python <path> <data>'
            const pythonProcess = spawn('python', [scriptLocation, payloadString]);

            let standardOutput = '';

            pythonProcess.stdout.on('data', (data) => {
                standardOutput += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`Python Engine Runtime Error: ${data}`);
            });

            pythonProcess.on('close', (exitCode) => {
                if (exitCode !== 0) {
                    return reject(new Error(`AI execution failed with code ${exitCode}`));
                }
                try {
                    const parsedData = JSON.parse(standardOutput);
                    resolve(parsedData);
                } catch (err) {
                    reject(new Error("Unable to read machine learning payload output lines."));
                }
            });
        });
    }
}

module.exports = ForecastingEngine;