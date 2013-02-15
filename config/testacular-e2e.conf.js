basePath = '../';

files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'test/e2e/**/*.js'
];

autoWatch = false;

browsers = ['Chrome','Firefox'];

singleRun = true;

reporters = ['junit'];

proxies = {
  '/': 'http://localhost:8000/'
};

junitReporter = {
  outputFile: 'logs/e2e-results.xml',
  suite: 'e2e'
};
