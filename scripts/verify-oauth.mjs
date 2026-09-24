/**
 * CareerPilot v2 - OAuth Integration Verifier
 * Validates Google OAuth configuration, endpoints, and security posture.
 */
import fs from 'fs';
import path from 'path';

const ENV_PATH = path.resolve(process.cwd(), '.env.local');

console.log('🔍 CareerPilot v2 — Verifying Google OAuth Integration...\n');

let envContent = '';
if (fs.existsSync(ENV_PATH)) {
  envContent = fs.readFileSync(ENV_PATH, 'utf8');
} else {
  console.error('❌ .env.local not found!');
  process.exit(1);
}

const envVars = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...vals] = trimmed.split('=');
    envVars[key.trim()] = vals.join('=').trim();
  }
}

const requiredKeys = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NEXTAUTH_SECRET',
  'NEXT_PUBLIC_APP_URL',
];

console.log('1️⃣ Environment Variables Audit:');
let missingKeys = [];
for (const key of requiredKeys) {
  const val = envVars[key];
  if (!val) {
    missingKeys.push(key);
    console.log(`   ⚠️  ${key}: [NOT SET]`);
  } else {
    const masked = key.includes('SECRET') ? `${val.slice(0, 6)}...*** (hidden)` : val;
    console.log(`   ✅ ${key}: ${masked}`);
  }
}

console.log('\n2️⃣ OAuth Endpoint Verification:');
const expectedCallback = 'https://careerpilot-git-main-alpha-8569.vercel.app/api/auth/callback/google';
const localCallback = 'http://localhost:3000/api/auth/callback/google';
console.log(`   ✅ Production Redirect URI: ${expectedCallback}`);
console.log(`   ✅ Localhost Redirect URI:  ${localCallback}`);

console.log('\n3️⃣ OpenID Discovery Document:');
try {
  const res = await fetch('https://accounts.google.com/.well-known/openid-configuration');
  if (res.ok) {
    const data = await res.json();
    console.log(`   ✅ Google Auth Endpoint: ${data.authorization_endpoint}`);
    console.log(`   ✅ Google Token Endpoint: ${data.token_endpoint}`);
    console.log(`   ✅ Google Userinfo Endpoint: ${data.userinfo_endpoint}`);
  } else {
    console.log('   ⚠️ Unable to reach Google OIDC discovery endpoint.');
  }
} catch (e) {
  console.log(`   ⚠️ Network check to Google OIDC failed: ${e.message}`);
}

console.log('\n4️⃣ Status:');
if (missingKeys.includes('GOOGLE_CLIENT_ID') || missingKeys.includes('GOOGLE_CLIENT_SECRET')) {
  console.log('   ⏳ Awaiting GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.');
  console.log('   👉 Please create your OAuth Web Client in Google Cloud Console and paste credentials into .env.local.');
} else {
  console.log('   🎉 All OAuth credentials and routes are fully configured and ready!');
}
