
basePath = '../';

BDIR = 'scripts/browserstack/browsers/'; // browser directory

files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'test/e2e/**/*.js'
];

autoWatch = false;

browsers = ['safari_6_mountain_lion.sh'];

browsers = browsers.map(function(a) {
    return BDIR + a;
});

singleRun = true;

reporters = ['junit'];

proxies = {
  '/': 'http://hummedia.local'
};

junitReporter = {
  outputFile: '/var/www/hummedia/logs/e2e-results.xml',
  suite: 'e2e'
};

port = 9876;
captureTimeout = 180000
