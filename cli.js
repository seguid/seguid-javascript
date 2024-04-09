#!/usr/bin/env node

const { ArgumentParser } = require("argparse");
const { seguid, lsseguid, ldseguid, csseguid, cdseguid } = require("./seguid");
var pjson = require("./package.json");

const parser = new ArgumentParser({
    description:
        "seguid: Sequence Globally Unique Identifier (SEGUID) Checksums for Linear, Circular, Single- and Double-Stranded Biological Sequences",
});
parser.add_argument("--alphabet", {
    type: "str",
    nargs: "?",
    help: "Type of input sequence",
});
parser.add_argument("--type", {
    type: "str",
    nargs: "?",
    default: "seguid",
    help: "Type of checksum to calculate",
});
parser.add_argument("--form", {
    // can only be short or long
    help: "computes a short form of the checksum",
    type: "str",
    nargs: "?",
    default: "long",
    choices: ["short", "long", "both"],
});
parser.add_argument("--version", {
    action: "version",
    version: pjson.version,
});

const args = parser.parse_args();
const alphabet = args.alphabet || "{DNA}";
const form = args.form;
const type = args.type;
const fun = {
    seguid: seguid,
    lsseguid: lsseguid,
    ldseguid: ldseguid,
    csseguid: csseguid,
    cdseguid: cdseguid,
}[type];

let data = "";
process.stdin.on("data", (chunk) => {
    data += chunk;
});

process.stdin.on("end", async () => {
    try {
        data = data.replace(/\n$/, "");
        if (type === "seguid" || type === "lsseguid" || type === "csseguid") {
            console.log(await fun(data, alphabet, form));
        }
        if (type === "ldseguid" || type === "cdseguid") {
            if (data.includes(";")) {
                [watson, crick] = data.split(";");
            } else if (data.includes("\n")) {
                [watson, crick] = data.split("\n");
                crick = crick.split("").reverse().join("");
            }
            console.log(await fun(watson, crick, alphabet, form));
        }
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
});
