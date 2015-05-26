/* Add Alloy in the global scope so that required module can have access */
this.Alloy = require("alloy"); this._ = Alloy._; this.Backbone = Alloy.Backbone;

describe("Sample test description", function () {
    it("has been auto-generated", function () {
        expect(true).toBe(true);
    });
});

/* To launch,
 * - Start a TiShadow server : tishadow server
 * - Build the app as a tishadow bundle :  ti build -p xxx --appify
 * - Ask TiShadow : tishadow spec
 * 
 * or, simply launch 'gulp test:jasmine' which will do all tasks above
 * for you.
 */
