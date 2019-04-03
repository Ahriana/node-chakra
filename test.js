const addon = require('./src');
const userCode = 'const one = 1; const five = 5; one + five';

const time = Date.now();
console.log(addon.run(userCode));
console.log(`${Date.now() - time}ms`);
