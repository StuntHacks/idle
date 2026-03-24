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
            autoAcceptOfflineTime: Setting<boolean>;
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
    internal: {
        title: string;
        settings: {
            quantum: {
                fluctuators: [
                    boolean, boolean, boolean, boolean, boolean, boolean
                ],
                fields: [
                    QField, QField, QField, QField, QField, QField
                ]
            }
        }
    };
}

type QField = QuantumFieldSettings;
type QuantumFieldType = "lepton" | "quark" | "gluon" | "higgs" | "electroweak" | "neutrino";
interface QuantumFieldSettings {
    selected: QuantumFieldType;
    next?: QuantumFieldType;
}

export interface Setting<T> {
    value: T;
    default: T;
    name: string;
    description?: string;
    options?: {
        name: string;
        value: T;
    }[];
    action?: string;
}
