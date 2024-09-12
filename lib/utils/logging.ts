// Global variable to hold the logEnabled state
let logEnabled: boolean = false;

// Function to set the logEnabled value in both global variable and localStorage
// @ts-ignore
window.setLog = function (enabled: boolean): void {
    logEnabled = enabled;
    localStorage.setItem("logEnabled", JSON.stringify(enabled));
};

// Function to log messages based on logEnabled value
export function log(message: any, ...optionalParams: any[]): void {
    if (logEnabled) {
        console.log(message, ...optionalParams);
    }
}
