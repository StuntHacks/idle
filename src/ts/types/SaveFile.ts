import { Settings } from "./Settings";

export interface SaveFile {
    settings: Settings;
    upgrades: {
        quantum: {
            
        }
    },
    flags: {
        tutorial: {

        },
        quantum: {
            gluons?: boolean;
            gen2?: boolean;
            gen3?: boolean;
            electroweak?: boolean;
            higgs?: boolean;
            forces?: boolean;
        }
    }
}

export interface SaveFileUpgrade {

}
