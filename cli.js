const { ArgumentParser } = require("argparse");
const { lsseguid, ldseguid, csseguid, cdseguid } = require("./seguid");

const parser = new ArgumentParser({
    description: "Calculate SEGUID checksums",
});
parser.add_argument("--alphabet", {
    type: "str",
    nargs: "?",
    help: "Type of input sequence",
});
parser.add_argument("--type", {
    type: "str",
    nargs: "?",
    help: "Type of checksum to calculate",
});
parser.add_argument("--short-form", {
    help: "computes a short form of the checksum",
    action: "store_true",
});

const args = parser.parse_args();
const alphabet = args.alphabet || "{DNA}";
const short_form = args.short_form || false;
const type = args.type;
const fun = {
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
        data = data.trim();
        if (type === "lsseguid" || type === "csseguid") {
            console.log(await fun(data, alphabet, short_form));
        }
        if (type === "ldseguid" || type === "cdseguid") {
            if (data.includes(";")) {
                [watson, crick] = data.split(";");
            } else if (data.includes("\n")) {
                [watson, crick] = data.split("\n");
            }
            console.log(await fun(watson, crick, alphabet, short_form));
        }
    } catch (e) {
        console.error(e.message);
    }
});
