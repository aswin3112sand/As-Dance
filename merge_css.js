const fs = require('fs');
const path = require('path');

// Use explicit absolute path to avoid CWD confusion
const dir = 'c:\\Users\\riote\\Downloads\\as_dance_full_project\\frontend\\src\\ui';
const stylesPath = path.join(dir, 'styles.css');
const headerPath = path.join(dir, 'header_new.css');

try {
    console.log('Reading ' + stylesPath);
    const stylesContent = fs.readFileSync(stylesPath, 'utf8');
    const stylesLines = stylesContent.split(/\r?\n/);
    console.log('Original lines: ' + stylesLines.length);

    console.log('Reading ' + headerPath);
    const headerContent = fs.readFileSync(headerPath, 'utf8');

    // Slice from 1600 (start of legacy)
    const tailLines = stylesLines.slice(1600);
    console.log('Tail lines: ' + tailLines.length);

    // Join with newline in case
    const tailContent = tailLines.join('\n');
    const finalContent = headerContent + "\n" + tailContent;

    console.log('Overwriting styles.css...');
    fs.writeFileSync(stylesPath, finalContent, 'utf8');
    console.log('SUCCESS: styles.css updated.');
} catch (e) {
    console.error('ERROR:', e);
    process.exit(1);
}
