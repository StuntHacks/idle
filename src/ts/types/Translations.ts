export interface TranslationMap {
    [key: string]: Translation;
}

export interface Translation {
    settings: {
        general: {
            title: string;
            noTabHistory: {
                name: string;
                description: string;
            };
            language: {
                name: string;
                description: string;
            };
        };
        gameplay: {
            title: string;
            noOfflineTime: {
                name: string;
                description: string;
            };
        };
        display: {
            title: string;
            darkNavigation: {
                name: string;
                description: string;
            };
        };
        debug: {
            title: string;
            logging: {
                name: string;
                description: string;
            };
            verbose: {
                name: string;
                description: string;
            };
        };
    };
    ui: {
        header: {

        };
        footer: {
            generations: {
                first: string;
                second: string;
                third: string;
            };
            quarks: {
                up: string;
                down: string;
                charm: string;
                strange: string;
                top: string;
                bottom: string;
            };
            leptons: {
                electron: string;
                muon: string;
                tau: string;
            };
            bosons: {
                name: string;
                higgs: string;
                photon: string;
                gluon: string;
                wPlus: string;
                wMinus: string;
                z: string;
            }
        };
    };
}
