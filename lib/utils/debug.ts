// Global variable to hold the debugEnabled state
let debugEnabled: boolean = false;
let debugEnabledInit: boolean = false;

// Function to set the debugEnabled value in both global variable and localStorage
// @ts-ignore
window.setDebug = function (enabled: boolean): boolean {
    debugEnabled = enabled;
    localStorage.setItem("debugEnabled", JSON.stringify(enabled));
    return debugEnabled;
};

export function isDebug(): boolean {
    if (debugEnabledInit === true) {
        return debugEnabled;
    }

    debugEnabledInit = true;

    // @ts-ignore
    return window.setDebug(
        localStorage.getItem("debugEnabled") === "true" || false,
    );
}

// Function to log messages based on debugEnabled value
export function debug(message: any, ...optionalParams: any[]): void {
    if (debugEnabled) {
        console.debug(message, ...optionalParams);
    }
}
