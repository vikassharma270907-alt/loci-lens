const fs = require('fs');

const requiredAssets = [
  'index.html',
  'styles.css',
  'preview-runner.js',
  'preview/index.html',
  'preview/styles.css',
  'preview/preview-runner.js',
  'torquelock_ar_demo_walkthrough.mp4',
  'torquelock_ar_youtube_thumbnail.png',
  'torquelock_demo_captions.srt',
  'torquelock_demo_captions.vtt',
  'devpost/design-brief.md',
  'devpost/submission.md',
  'RESEARCH_EVIDENCE.md',
  'SOURCE_NOTES.md'
];

let missing = [];
for (const file of requiredAssets) {
  if (!fs.existsSync(file)) {
    missing.push(file);
  }
}

if (missing.length > 0) {
  console.error(`Asset verification failed. Missing ${missing.length} files:`);
  missing.forEach(f => console.error(` - ${f}`));
  process.exit(1);
}

console.log(`✓ All ${requiredAssets.length} required assets verified successfully.`);
