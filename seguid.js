const rotate = (s, n) => {
    return s.slice(n) + s.slice(0, n);
};

const SEGUID = async (seq) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(seq.toUpperCase());
    try {
        const hashBuffer = await crypto.subtle.digest("SHA-1", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashString = hashArray
            .map((b) => String.fromCharCode(b))
            .join("");
        const encodedHash = btoa(hashString);
        return encodedHash
            .replace(/\n|=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
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
    "{IUPAC}": "GC,AT,BV,DH,KM,SS,RY,WW,NN",
    "{protein}": "A,C,D,E,F,G,H,I,K,L,M,N,P,Q,R,S,T,V,W,Y,-",
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

const apply_form = (s, short_form) => {
    if (short_form) {
        return s.split("=")[1].slice(0, 6);
    } else {
        return s;
    }
};

const lsseguid = async (s, alphabet = "{DNA}", short_form = false) => {
    if (!check_set(s, alphabet)) {
        throw new Error("Invalid sequence");
    }
    const seguid = await SEGUID(s);
    return apply_form("lsseguid=" + seguid, short_form);
};

const ldseguid = async (
    watson,
    crick,
    alphabet = "{DNA}",
    short_form = false
) => {
    if (!check_complementary(watson, crick, alphabet)) {
        throw new Error("Invalid sequences");
    }
    if (watson < crick) {
        spec = watson + ";" + crick;
    } else {
        spec = crick + ";" + watson;
    }
    const seguid = await SEGUID(spec);
    return apply_form("ldseguid=" + seguid, short_form);
};

const csseguid = async (s, alphabet = "{DNA}", short_form = false) => {
    if (!check_set(s, alphabet)) {
        throw new Error("Invalid sequence");
    }
    const seguid = await SEGUID(minRotation(s));
    return apply_form("csseguid=" + seguid, short_form);
};

const cdseguid = async (
    watson,
    crick,
    alphabet = "{DNA}",
    short_form = false
) => {
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

    const seguid = await SEGUID(spec);
    return apply_form("cdseguid=" + seguid, short_form);
};

module.exports = {
    lsseguid,
    ldseguid,
    csseguid,
    cdseguid,
    SEGUID,
};
