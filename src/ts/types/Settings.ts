export interface Settings {
    general: {
        title: string;
        settings: {
            language: Setting<"en" | "de">
            noTabHistory: Setting<boolean>;
        };
    };
    gameplay: {
        title: string;
        settings: {
            noOfflineTime: Setting<boolean>;
        };
    };
    display: {
        title: string;
        settings: {
            darkNavigation: Setting<boolean>;
            reverseBottomBar: Setting<boolean>;
            stillFields: Setting<boolean>;
        }
    };
    debug: {
        title: string;
        settings: {
            logging: Setting<boolean>;
            verbose: Setting<boolean>;
        };
    };
}

export interface Setting<T> {
    value: T;
    default: T;
    name: string;
    description?: string;
}
