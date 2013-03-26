basePath = '../';

files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'test/e2e/**/*.js'
];

autoWatch = false;

browsers = ['config/browserstack/browsers/safari_6_mountain_lion.sh'];

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
