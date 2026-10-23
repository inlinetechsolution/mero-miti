const { execSync } = require('child_process');
const path = require('path');

console.log('🇳🇵 Running Mero Miti Multi-Platform Test Suites...\n');

const suites = [
  { name: 'Core Engine (Node.js)', cmd: 'node packages/core/test/test-core.js' },
  { name: 'Python Pure-Engine', cmd: 'python -m unittest packages/python/tests/test_core.py' },
  { name: 'PHP Calendar Engine', cmd: 'php packages/php/tests/MeroMitiTest.php' },
  { name: 'C# / .NET Calendar Engine', cmd: 'dotnet run --project packages/dotnet/tests/MeroMiti.Tests.csproj' },
  { name: 'Flutter / Dart Calendar Engine', cmd: 'dart run --enable-asserts packages/flutter/test/test_core.dart' },
];

let failed = false;

for (const suite of suites) {
  console.log(`--- Running: ${suite.name} ---`);
  try {
    execSync(suite.cmd, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
    console.log(`✅ ${suite.name} PASSED\n`);
  } catch (err) {
    console.error(`❌ ${suite.name} FAILED\n`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log('🎉 All test suites completed successfully!');
}
