const rotate = (s, n) => {
    return s.slice(n) + s.slice(0, n);
};

const SEGUID = async (seq, urlsafe = false) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(seq);
    try {
        const hashBuffer = await crypto.subtle.digest("SHA-1", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashString = hashArray
            .map((b) => String.fromCharCode(b))
            .join("");
        const encodedHash = btoa(hashString);
        if (urlsafe) {
            return encodedHash
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=/g, "");
        }
        return encodedHash.replace(/=/g, "");
    } catch (error) {
        console.error("Error calculating SHA-1 hash:", error);
        return null;
    }
};

const minRotation = (s, return_index = false) => {
    let N = s.length;
    s += s;
    let a = 0,
        b = 0;
    while (b < N) {
        for (let i = 0; i < N - a; i++) {
            let sai = s[a + i];
            let sbi = s[b + i];
            if (sai < sbi || a + i === b) {
                if (i) {
                    b += i - 1;
                }
                break;
            }
            if (sai > sbi) {
                a = b;
                break;
            }
        }
        b += 1;
    }
    if (return_index) return [s.slice(a, a + N), a];
    return s.slice(a, a + N);
};

ALPHABETS = {
    "{DNA}": "GC,AT",
    "{RNA}": "GC,AU",
    "{DNA-extended}": "GC,AT,BV,DH,KM,SS,RY,WW,NN",
    "{RNA-extended}": "GC,AU,BV,DH,KM,SS,RY,WW,NN",
    "{protein}": "A,C,D,E,F,G,H,I,K,L,M,N,P,Q,R,S,T,V,W,Y",
    "{protein-extended}": "A,C,D,E,F,G,H,I,K,L,M,N,P,Q,R,S,T,V,W,Y,O,U,B,J,X,Z"
};

const expand_alphabet = (alphabet) => {
    for (let key in ALPHABETS) {
        alphabet = alphabet.replace(key, ALPHABETS[key]);
    }
    alphabet = alphabet.split(",");

    // check lengths
    var lengths = new Set();
    for (let i = 0; i < alphabet.length; i++) {
        lengths.add(alphabet[i].length);
    }
    if (lengths.size !== 1) {
        throw new Error("Alphabet contains strings of different lengths");
    }
    const length = lengths.values().next().value;
    if (length !== 1 && length !== 2) {
        throw new Error("Alphabet contains strings of length " + length);
    }

    // make set
    alphabet = new Set(alphabet);
    if (length === 2) {
        for (let s of alphabet) {
            alphabet.add(s[1] + s[0]);
        }
        for (let s of alphabet) {
            alphabet.add(s[0] + "-");
            alphabet.add("-" + s[0]);
        }
    }
    return alphabet;
};

const check_set = (seq, alphabet) => {
    if (seq.length === 0) {
        return false;
    }
    alphabet = new Set(Array.from(expand_alphabet(alphabet)).map((s) => s[0]));
    for (let i = 0; i < seq.length; i++) {
        if (!alphabet.has(seq[i])) {
            return false;
        }
    }
    return true;
};

const check_complementary = (watson, crick, alphabet) => {
    alphabet = expand_alphabet(alphabet);
    if (watson.length === 0) {
        return false;
    }
    if (watson.length !== crick.length) {
        return false;
    }
    const n = watson.length;
    for (let i = 0; i < watson.length; i++) {
        if (!alphabet.has(watson[i] + crick[n - 1 - i])) {
            return false;
        }
    }
    return true;
};

const apply_form = (s, form) => {
    const short_form = s.split("=")[1].slice(0, 6);
    if (form === "short") {
        return short_form;
    } else if (form === "long") {
        return s;
    } else if (form === "both") {
        return short_form + " " + s;
    } else {
        throw new Error("Invalid form " + form);
    }
};

const seguid = async (s, alphabet = "{DNA}", form = "long") => {
    if (!check_set(s, alphabet)) {
        throw new Error("Invalid sequence");
    }
    const seguid = await SEGUID(s);
    return apply_form("seguid=" + seguid, form);
};

const lsseguid = async (s, alphabet = "{DNA}", form = "long") => {
    if (!check_set(s, alphabet)) {
        throw new Error("Invalid sequence");
    }
    const seguid = await SEGUID(s, true);
    return apply_form("lsseguid=" + seguid, form);
};

const ldseguid = async (watson, crick, alphabet = "{DNA}", form = "long") => {
    if (!check_complementary(watson, crick, alphabet)) {
        throw new Error("Invalid sequences");
    }
    if (watson < crick) {
        spec = watson + ";" + crick;
    } else {
        spec = crick + ";" + watson;
    }
    const seguid = await SEGUID(spec, true);
    return apply_form("ldseguid=" + seguid, form);
};

const csseguid = async (s, alphabet = "{DNA}", form = "long") => {
    if (!check_set(s, alphabet)) {
        throw new Error("Invalid sequence");
    }
    const seguid = await SEGUID(minRotation(s), true);
    return apply_form("csseguid=" + seguid, form);
};

const cdseguid = async (watson, crick, alphabet = "{DNA}", form = "long") => {
    if (!check_complementary(watson, crick, alphabet)) {
        throw new Error("Invalid sequences");
    }
    const [mwatson, idxwatson] = minRotation(watson, true);
    const [mcrick, idxcrick] = minRotation(crick, true);
    if (mwatson < mcrick) {
        spec = mwatson + ";" + rotate(crick, -idxwatson);
    } else {
        spec = mcrick + ";" + rotate(watson, -idxcrick);
    }

    const seguid = await SEGUID(spec, true);
    return apply_form("cdseguid=" + seguid, form);
};

module.exports = {
    seguid,
    lsseguid,
    ldseguid,
    csseguid,
    cdseguid,
    SEGUID,
};
