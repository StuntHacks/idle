import { SAVE_FILE_NAME } from "SaveHandler/SaveHandler";
import { Logger } from "./Logger";

export const handleError = (e: unknown) => {
    document.body.classList.add("error");
    const stackTrace = document.getElementById("stack-trace");
    stackTrace.textContent = e instanceof Error ? e.stack : String(e);
    stackTrace.textContent += `\n\n ======== CONSOLE LOGS ======== \n\n` + Logger.getHistory();
    stackTrace.textContent += `\n\n ======== SAVE FILE ======== \n\n` + localStorage.getItem(SAVE_FILE_NAME);
    const copyButton = document.getElementById("error-screen-copy-button");
    copyButton.addEventListener("click", function () {
        copyButton.textContent = "Copied!";
        navigator.clipboard.writeText(stackTrace.textContent);
        setTimeout(() => copyButton.textContent = "Copy to clipboard", 1000);
    });

    document.getElementById("error-screen-reset-button").addEventListener("click", function() {
        if (window.confirm("Are you sure you want to reset? This will most likely fix the error, but your progress will be gone. MAKE SURE TO HAVE A BACKUP!")) {
            localStorage.removeItem(SAVE_FILE_NAME);
            localStorage.removeItem("idledynamics_settings");
            location.reload();
        }
    });
}
