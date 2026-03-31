import { FieldModel } from "./Field";

interface FieldData {
    [key: string]: FieldModel;
};

export const FIELD_DATA: FieldData = {
    lepton: {
        gradient: "electron",
        clickDelay: 1000,
        name: "stages.quantum.fields.electron.name",
        subFields: [
            {
                type: "lepton",
                flavor: "tau",
                fieldColor: { start: "#999944", end: "#999977", glow: "#999900" },
                requirement: "quantum.fields.tau"
            },
            {
                type: "lepton",
                flavor: "muon",
                fieldColor: { start: "#cccc77", end: "#ccccaa", glow: "#cccc00" },
                requirement: "quantum.fields.muon"
            },
            {
                type: "lepton",
                flavor: "electron",
                fieldColor: { start: "#ffffaa", end: "#ffffDD", glow: "#ffff00" }
            }
        ]
    },
    quark: {
        gradient: "rgb",
        clickDelay: 700,
        name: "stages.quantum.fields.quark.name",
        multi: {
            type: "quark",
            flavor: ["up", "down"]
        },
        subFields: [
            {
                type: "quark",
                color: "green",
                flavor: ["up", "down"],
                fieldColor: { start: "#00ff00", end: "#00ffff", glow: "#00ff00" }
            },
            {
                type: "quark",
                color: "blue",
                flavor: ["up", "down"],
                fieldColor: { start: "#0000ff", end: "#00ffff", glow: "#00ffff" }
            },
            {
                type: "quark",
                color: "red",
                flavor: ["up", "down"],
                fieldColor: { start: "#ff0000", end: "#ff00ff", glow: "#ff00ff" }
            }
        ]
    },
    gluon: {
        gradient: "gluon",
        clickDelay: 2000,
        name: "stages.quantum.fields.gluon.name",
        triple: true,
        subFields: [
            {
                type: "boson",
                flavor: "gluon",
                fieldColor: { start: "#00aabb", end: "#00ff44", glow: "#00ffff" }
            }
        ]
    },
    higgs: {
        gradient: "higgs",
        clickDelay: -1,
        name: "stages.quantum.fields.higgs.name",
        thick: true,
        subFields: [
            {
                type: "boson",
                flavor: "higgs",
                fieldColor: { start: "#998800", end: "#bb9900", glow: "#DDAA00" }
            }
        ]
    },
    electroweak: {
        gradient: "electroweak",
        clickDelay: 2000,
        name: "stages.quantum.fields.electroweak.name",
        multi: {
            type: "boson",
            flavor: "photon",
        },
        subFields: [
            {
                type: "boson",
                flavor: "w-plus",
                fieldColor: { start: "#aaaaaa", end: "#dddddd", glow: "#dddddd" }
            },
            {
                type: "boson",
                flavor: "w-minus",
                fieldColor: { start: "#aaaaaa", end: "#dddddd", glow: "#dddddd" }
            },
            {
                type: "boson",
                flavor: "z",
                fieldColor: { start: "#aaaaaa", end: "#dddddd", glow: "#dddddd" }
            }
        ]
    },
    neutrino: {
        gradient: "neutrino",
        clickDelay: 1000,
        name: "stages.quantum.fields.neutrino.name",
        subFields: [
            {
                type: "lepton",
                flavor: "tau-neutrino",
                fieldColor: { start: "#999944", end: "#999977", glow: "#999900" }
            },
            {
                type: "lepton",
                flavor: "muon-neutrino",
                fieldColor: { start: "#cccc77", end: "#ccccaa", glow: "#cccc00" }
            },
            {
                type: "lepton",
                flavor: "electron-neutrino",
                fieldColor: { start: "#ffffaa", end: "#ffffDD", glow: "#ffff00" }
            }
        ]
    }
}
