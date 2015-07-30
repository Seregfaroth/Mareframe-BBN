exports.config = {
  framework: 'jasmine2',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['e2e/test.js'],
  capabilities: {
  	browserName: "firefox"
  },
  onPrepare: function() {
  	global.bv = browser.driver;
  }

}
