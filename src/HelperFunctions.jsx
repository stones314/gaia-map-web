import {
    advTechToLetter,
    baseTechToLetter,
    fedToLetter,
    roundVpToLetter,
    boosterToLetter,
    endVpToLetter,
    baseTech
} from './Defs';

export function GetRandomElements(array, number) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, number);
}

export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export function getRemainingBaseTech(selectedTech) {
    var out = [];
    for (const [, t] of baseTech.entries()) {
        if (!selectedTech.includes(t))
            out.push(t);
    }
    return out;
}

export function getSetupString(setup) {
    //setup: {
    //    feds: GetRandomElements(feds, 1),
    //    advTech: GetRandomElements(advTech, 6),
    //    baseTech: GetRandomElements(baseTech, 9),
    //    rounds: GetRandomElements(roundVps, 6),
    //    boosts: GetRandomElements(boosters, 7),
    //    endVps: GetRandomElements(endVps, 2),
    //}
    let setupString = "";
    for (const [i, x] of setup.feds.entries()) {
        setupString += fedToLetter[x];
    }
    for (const [i, x] of setup.advTech.entries()) {
        setupString += advTechToLetter[x];
    }
    for (const [i, x] of setup.baseTech.entries()) {
        setupString += baseTechToLetter[x];
    }
    for (const [i, x] of setup.rounds.entries()) {
        setupString += roundVpToLetter[x];
    }
    for (const [i, x] of setup.endVps.entries()) {
        setupString += endVpToLetter[x];
    }
    for (const [i, x] of setup.boosts.entries()) {
        setupString += boosterToLetter[x];
    }
    return setupString;
}

export function getSetupFromString(setupString) {
    var out = {
        setup : {
            feds: [],
            advTech: [],
            baseTech: [],
            rounds: [],
            endVps: [],
            boosts: [],
        },
        errorMsg : "",
        valid : false,
    };
    if (setupString.length < 26 || setupString.length > 28) {
        out.errorMsg = "Incorrect setup string, must have 29-31 characters (based on number of boosters).";
        return out;
    }
    var component = getKeyByValue(fedToLetter, setupString[0]);
    if (component) {
        out.setup.feds.push(component);
    } else {
        out.errorMsg = "Incorrect setup string, " + setupString[0] + " at position " + 0 +" is not a valid federation.";
        return out;
    }
    var i = 1;
    for (;i < 7; i++) {
        component = getKeyByValue(advTechToLetter, setupString[i]);
        if (component) {
            out.setup.advTech.push(component);
        } else {
            out.errorMsg = "Incorrect setup string, " + setupString[i] + " at position " + i + " is not a valid advanced tech.";
            return out;
        }
    }
    for (; i < 13; i++) {
        component = getKeyByValue(baseTechToLetter, setupString[i]);
        if (component) {
            out.setup.baseTech.push(component);
        } else {
            out.errorMsg = "Incorrect setup string, " + setupString[i] + " at position " + i + " is not a valid base tech.";
            return out;
        }
    }
    for (; i < 19; i++) {
        component = getKeyByValue(roundVpToLetter, setupString[i]);
        if (component) {
            out.setup.rounds.push(component);
        } else {
            out.errorMsg = "Incorrect setup string, " + setupString[i] + " at position " + i + " is not a valid round scoring.";
            return out;
        }
    }
    for (; i < 21; i++) {
        component = getKeyByValue(endVpToLetter, setupString[i]);
        if (component) {
            out.setup.endVps.push(component);
        } else {
            out.errorMsg = "Incorrect setup string, " + setupString[i] + " at position " + i + " is not a valid end scoring.";
            return out;
        }
    }
    for (; i < setupString.length; i++) {
        component = getKeyByValue(boosterToLetter, setupString[i]);
        if (component) {
            out.setup.boosts.push(component);
        } else {
            out.errorMsg = "Incorrect setup string, " + setupString[i] + " at position " + i + " is not a valid booster.";
            return out;
        }
    }
    out.valid = true;
    return out;
}