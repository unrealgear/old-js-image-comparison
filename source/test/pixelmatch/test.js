"use strict";

const PNG = require("pngjs").PNG,
    fs = require("fs"),
    path = require("path"),
    chai = require("chai"),
    match = require("pixelmatch");

chai.should();

describe("Using pixelmatch for comparison", async function () {
    let testData = [
        {imgPath1: "1a", imgPath2: "1b", diffPath: "1diff", threshold: 0.05, includeAA: false, expectedMismatch: 143},
        {imgPath1: "2a", imgPath2: "2b", diffPath: "2diff", threshold: 0.05, includeAA: false, expectedMismatch: 12439},
        {imgPath1: "3a", imgPath2: "3b", diffPath: "3diff", threshold: 0.05, includeAA: false, expectedMismatch: 212},
        {imgPath1: "4a", imgPath2: "4b", diffPath: "4diff", threshold: 0.05, includeAA: false, expectedMismatch: 36089}
    ];

    testData.forEach(async function (dataSet) {
        it("Check base screenshot " + dataSet.imgPath1, async function () {
            await diffTest(dataSet.imgPath1, dataSet.imgPath2, dataSet.diffPath, dataSet.threshold, dataSet.includeAA,
                dataSet.expectedMismatch);
        });
    });

    async function diffTest(imgPath1, imgPath2, diffPath, threshold, includeAA, expectedMismatch) {
        console.log("comparing " + imgPath1 + " to " + imgPath2 +
            ", threshold: " + threshold + ", includeAA: " + includeAA + "\n");

        let img1 = readImage(imgPath1);
        let img2 = readImage(imgPath2);
        let expectedDiff = readImage(diffPath);
        let diff = new PNG({width: img1.width, height: img1.height});

        let mismatch = match(img1.data, img2.data, diff.data, diff.width, diff.height, {
            threshold: threshold,
            includeAA: includeAA
        });

        let mismatch2 = match(img1.data, img2.data, null, diff.width, diff.height, {
            threshold: threshold,
            includeAA: includeAA
        });

        // await diff.data.should.equal(expectedDiff.data, "diff image");
        await mismatch.should.equal(expectedMismatch, "number of mismatched pixels");
        await mismatch.should.equal(mismatch2, "number of mismatched pixels");
    }

    function readImage(name) {
        return PNG.sync.read(fs.readFileSync(path.join(__dirname, "images", name + ".png")))
    }
});

describe("Simple example from GitHub", function () {
    it("Run example", function () {
        let img1 = fs.createReadStream(path.join(__dirname, "images", "2a.png")).pipe(new PNG()).on("parsed", doneReading),
            img2 = fs.createReadStream(path.join(__dirname, "images", "2b.png")).pipe(new PNG()).on("parsed", doneReading),
            filesRead = 0;

        function doneReading() {
            if (++filesRead < 2) return;
            let diff = new PNG({width: img1.width, height: img1.height});

            match(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: 0.1});

            // create folder 'results' or provide permissions to create folders
            diff.pack().pipe(fs.createWriteStream(path.join(__dirname, "results", "diff-example.png")));
        }
    })
});

describe("Basic example", function () {
    let img1 = PNG.sync.read(fs.readFileSync(path.join(__dirname, "images", "2a.png"))),
        img2 = PNG.sync.read(fs.readFileSync(path.join(__dirname, "images", "2b.png")));

    it("Run basic example", function () {
        let diff = new PNG({width: img1.width, height: img1.height});

        // numberOfDiffs is a number
        let numberOfDiffs = match(img1.data, img2.data, diff.data, img1.width, img1.height);

        // create folder 'results' or provide permissions to create folders
        diff.pack().pipe(fs.createWriteStream(path.join(__dirname, "results", "diff-basic.png")));
    })
});
