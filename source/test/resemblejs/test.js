"use strict";

const compareImages = require("resemblejs/compareImages");
const fs = require("mz/fs");

describe("Basic example of resemblejs", async function () {
    it("Run from chai test", async function () {
        const options = {
            output: {
                errorColor: {
                    red: 255,
                    green: 0,
                    blue: 255
                },
                errorType: "movement",
                transparency: 0.3,
                largeImageThreshold: 1200,
                useCrossOrigin: false,
                outputDiff: true
                //boundingBox: {
                //     left: 100,
                //     top: 200,
                //     right: 200,
                //     bottom: 600
                // },
                // ignoredBox: {
                //     left: 100,
                //     top: 200,
                //     right: 200,
                //     bottom: 600
                // }

                // http://rsmbl.github.io/Resemble.js/
            },
            scaleToSameSize: true,
            ignore: "antialiasing"
        };

        // The parameters can be Node Buffers
        // data is the same as usual with an additional getBuffer() function
        const data = await compareImages(
            await fs.readFile(__dirname + "/images/People.jpg"),
            await fs.readFile(__dirname + "/images/People2.jpg"),
            options
        );

        // create results directory before run
        await fs.writeFile(__dirname + "/results/output.png", data.getBuffer());
    })
});
