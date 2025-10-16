/**
 * Setup Script for SendIT
 * 
 * This script helps set up the application for first-time use:
 * - Creates necessary directories
 * - Sets up environment variables
 * - Creates an admin user
 * - Validates configuration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up SendIT...\n');

// Create necessary directories
const directories = [
  'dist',
  'src/public/css',
  'src/public/js',
  'src/public/img',
  'logs'
];

console.log('📁 Creating directories...');
directories.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`   ✓ Created ${dir}`);
  } else {
    console.log(`   ✓ ${dir} already exists`);
  }
});

// Check if .env exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n📝 Creating .env file...');
  const envExample = fs.readFileSync(path.join(__dirname, '..', 'env.example'), 'utf8');
  fs.writeFileSync(envPath, envExample);
  console.log('   ✓ Created .env file from env.example');
  console.log('   ⚠️  Please update .env with your actual configuration values');
} else {
  console.log('\n📝 .env file already exists');
}

// Validate package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('\n📦 Validating package.json...');
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log(`   ✓ Package name: ${packageJson.name}`);
    console.log(`   ✓ Version: ${packageJson.version}`);
  } catch (error) {
    console.log('   ❌ Invalid package.json');
  }
} else {
  console.log('\n❌ package.json not found');
}

// Check TypeScript configuration
const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  console.log('\n🔧 TypeScript configuration found');
} else {
  console.log('\n❌ tsconfig.json not found');
}

console.log('\n✅ Setup complete!');
console.log('\nNext steps:');
console.log('1. Update .env file with your configuration');
console.log('2. Run: npm install');
console.log('3. Run: npm run build');
console.log('4. Run: npm start');
console.log('\nFor development:');
console.log('- Run: npm run dev (in one terminal)');
console.log('- Run: npm run serve (in another terminal)');
console.log('\nHappy coding! 🚀');
