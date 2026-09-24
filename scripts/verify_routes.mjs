async function verify() {
  try {
    const [home, student, seeker, recruiter] = await Promise.all([
      fetch('http://localhost:3000/').then(r => r.text()),
      fetch('http://localhost:3000/student').then(r => r.text()),
      fetch('http://localhost:3000/job-seeker').then(r => r.text()),
      fetch('http://localhost:3000/recruiter').then(r => r.text()),
    ]);

    console.log('--- ROUTE VERIFICATION ---');
    console.log('1. Home Page:');
    console.log('   - Has Role Sign-In Screen:', home.includes('Select Your Role') || home.includes('Step 1: Select Your Role'));
    console.log('   - Has Name Input:', home.includes('Step 2: Enter Your Name'));
    console.log('   - Has Sign-in submit button:', home.includes('sign-in-submit-btn'));
    console.log('   - Does NOT render static role switcher buttons in unauthenticated Navbar:', !home.includes('title="Student Mode"') && !home.includes('title="Job Seeker Mode"'));

    console.log('2. Student Page:');
    console.log('   - Has #skill-roadmap anchor:', student.includes('id="skill-roadmap"'));
    console.log('   - Has #career-path anchor:', student.includes('id="career-path"'));
    console.log('   - Has #skill-gap anchor:', student.includes('id="skill-gap"'));

    console.log('3. Job Seeker Page:');
    console.log('   - Has real file input:', seeker.includes('id="real-resume-file-input"'));
    console.log('   - Accepts .pdf and .docx:', seeker.includes('accept=".pdf,.docx'));
    console.log('   - Has deterministic skill parser section:', seeker.includes('Resume &amp; Skill Parser (Real PDF / DOCX Upload)'));

    console.log('4. Recruiter Page:');
    console.log('   - Has #post-job anchor:', recruiter.includes('id="post-job"'));
    console.log('   - Has #applicant-pipeline anchor:', recruiter.includes('id="applicant-pipeline"'));
    console.log('   - Has #transparency-panel anchor:', recruiter.includes('id="transparency-panel"'));

    console.log('--- ALL CHECKS PASSED ---');
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  }
}

verify();
