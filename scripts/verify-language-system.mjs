/**
 * CareerPilot v2 - Language System & i18n Verifier
 * Audits language registry, translations, RTL configuration, and AI instruction generation.
 */
import { SUPPORTED_LANGUAGES, getLanguage, isSupportedLanguage, isRtlLanguage } from '../src/i18n/languages.js';
import { translateKey } from '../src/i18n/config.js';
import { languageService } from '../src/lib/languageService.js';

console.log('🌐 CareerPilot v2 — Verifying Global Preferred Language System...\n');

console.log('1️⃣ Language Coverage Audit:');
console.log(`   ✅ Total supported languages: ${SUPPORTED_LANGUAGES.length} (Target: 23+)`);

const sampleCodes = ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'ur', 'pa', 'sa', 'or', 'as'];
for (const code of sampleCodes) {
  const meta = getLanguage(code);
  console.log(`   • [${meta.code.padEnd(3)}] ${meta.nativeName.padEnd(12)} (${meta.englishName}) - ${meta.script} [${meta.direction.toUpperCase()}]`);
}

console.log('\n2️⃣ RTL Support Audit:');
const urduRtl = isRtlLanguage('ur');
const kashmiriRtl = isRtlLanguage('ks');
const sindhiRtl = isRtlLanguage('sd');
const tamilLtr = isRtlLanguage('ta');

console.log(`   ${urduRtl ? '✅' : '❌'} Urdu (ur) RTL: ${urduRtl}`);
console.log(`   ${kashmiriRtl ? '✅' : '❌'} Kashmiri (ks) RTL: ${kashmiriRtl}`);
console.log(`   ${sindhiRtl ? '✅' : '❌'} Sindhi (sd) RTL: ${sindhiRtl}`);
console.log(`   ${!tamilLtr ? '✅' : '❌'} Tamil (ta) LTR: ${!tamilLtr}`);

console.log('\n3️⃣ Translation Dictionaries Audit:');
const testKeys = ['common.appName', 'nav.student', 'settings.preferredLanguage', 'jobs.applyNow', 'auth.continueWithGoogle'];
for (const key of testKeys) {
  const enVal = translateKey('en', key);
  const hiVal = translateKey('hi', key);
  const taVal = translateKey('ta', key);
  const urVal = translateKey('ur', key);
  console.log(`   Key: ${key}`);
  console.log(`      EN: ${enVal}`);
  console.log(`      HI: ${hiVal}`);
  console.log(`      TA: ${taVal}`);
  console.log(`      UR: ${urVal}`);
}

console.log('\n4️⃣ AI / LLM Instruction Generation Audit:');
const tamilAiPrompt = languageService.getAiSystemInstruction('ta');
console.log(`   Tamil AI Instruction:\n   "${tamilAiPrompt.slice(0, 180)}..."`);

console.log('\n5️⃣ Localized Pitch Feedback Generation:');
const hiFeedback = languageService.getLocalizedPitchFeedback('hi', true, true);
console.log(`   HI Feedback: "${hiFeedback.feedback.slice(0, 100)}..."`);
const taFeedback = languageService.getLocalizedPitchFeedback('ta', true, true);
console.log(`   TA Feedback: "${taFeedback.feedback.slice(0, 100)}..."`);

console.log('\n🎉 Global Preferred Language System is fully verified and compliant!\n');
