import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const components = [
  'SluiceGate',
  'SquareEdge',
  'RoundEdge',
  // 'RoundedSplitter',
  // 'PointedSplitter',
  // 'FlatSplitter',
  // 'SkiJump',
  // 'SlopingApron',
  // 'ReverseCurvature',
  // 'SiphonSpillway',
  // 'RoughenedBed',
  // 'TrapezoidalWeir',
  // 'ChangeWaterDepth'
];

const pagesDir = path.join(__dirname, 'src', 'pages');

// Create the pages directory if it doesn't exist
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

components.forEach(component => {
  const filePath = path.join(pagesDir, `${component}.tsx`);
  const content = `
import React from 'react';

const ${component}: React.FC = () => {
  return (
    <div>
      <h1>${component}</h1>
    </div>
  );
};

export default ${component};
  `;

  fs.writeFile(filePath, content.trim(), err => {
    if (err) {
      console.error('Error creating file ' + filePath + ': ', err);
    } else {
      console.log('File created: ' + filePath);
    }
  });
});
