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
}
