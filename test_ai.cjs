try {
  require('src/services/ai.js');
  console.log('Module OK');
} catch(e) {
  console.error('ERROR:', e.message);
  console.error('Line:', e.lineNumber);
}
