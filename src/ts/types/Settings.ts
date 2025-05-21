export interface Settings {
    general: {
        title: string;
        settings: {
            noTabHistory: Setting<boolean>;
        }
    }
    gameplay: {
        title: string;
        settings: {
            noOfflineTime: Setting<boolean>;
        }
    }
    debug: {
        title: string;
        settings: {
            logging: Setting<boolean>;
            verbose: Setting<boolean>;
        }
    },
}

export interface Setting<T> {
    value: T;
    default: T;
    name: string;
    description?: string;
}
