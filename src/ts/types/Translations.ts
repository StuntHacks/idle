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
            stillFields: {
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
            fermions: string;
            generations: {
                first: string;
                second: string;
                third: string;
            };
            quarks: {
                up: {
                    name: string;
                    flavorText: string;
                };
                down: {
                    name: string;
                    flavorText: string;
                };
                charm: {
                    name: string;
                    flavorText: string;
                };
                strange: {
                    name: string;
                    flavorText: string;
                };
                top: {
                    name: string;
                    flavorText: string;
                };
                bottom: {
                    name: string;
                    flavorText: string;
                };
            };
            leptons: {
                electron: {
                    name: string;
                    flavorText: string;
                };
                muon: {
                    name: string;
                    flavorText: string;
                };
                tau: {
                    name: string;
                    flavorText: string;
                };
            };
            bosons: {
                name: string;
                higgs: {
                    name: string;
                    flavorText: string;
                };
                photon: {
                    name: string;
                    flavorText: string;
                };
                gluon: {
                    name: string;
                    flavorText: string;
                };
                w_plus: {
                    name: string;
                    flavorText: string;
                };
                w_minus: {
                    name: string;
                    flavorText: string;
                };
                z: {
                    name: string;
                    flavorText: string;
                };
            }
        };
    };
};
