import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the seed file
const seedFilePath = path.join(__dirname, 'seedSMKTIBaliGlobal.ts');
const seedContent = fs.readFileSync(seedFilePath, 'utf-8');

// Extract the arrays using regex
function extractArray(content: string, arrayName: string): any[] {
  const regex = new RegExp(`const ${arrayName} = \\[([\\s\\S]*?)\\];`, 'm');
  const match = content.match(regex);
  if (!match) return [];

  try {
    // Simple extraction - this is a bit hacky but works for this purpose
    const arrayContent = match[1];
    // Count braces to find the end
    let braceCount = 0;
    let inString = false;
    let escapeNext = false;
    let start = content.indexOf(`const ${arrayName} = [`);
    let end = start;

    for (let i = start; i < content.length; i++) {
      const char = content[i];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === '\\') {
        escapeNext = true;
        continue;
      }

      if (char === '"' || char === "'") {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        if (char === ']' && braceCount === 0) {
          end = i + 1;
          break;
        }
      }
    }

    const arrayText = content.substring(start, end);
    // Use eval in a safe way - this is for development only
    const array = eval(arrayText.replace(`const ${arrayName} = `, ''));
    return array;
  } catch (error) {
    console.error(`Error extracting ${arrayName}:`, error);
    return [];
  }
}

function checkDuplicates(array: any[], arrayName: string) {
  const nisnMap = new Map<string, any[]>();
  const duplicates: any[] = [];

  array.forEach((item, index) => {
    if (!nisnMap.has(item.nisn)) {
      nisnMap.set(item.nisn, []);
    }
    nisnMap.get(item.nisn)!.push({ ...item, originalIndex: index });
  });

  nisnMap.forEach((items, nisn) => {
    if (items.length > 1) {
      duplicates.push({ nisn, count: items.length, items });
    }
  });

  console.log(`\n=== ${arrayName} ===`);
  console.log(`Total items: ${array.length}`);
  console.log(`Unique NISN: ${nisnMap.size}`);
  console.log(`Duplicates: ${duplicates.length}`);

  if (duplicates.length > 0) {
    console.log('\nDuplicate NISN details:');
    duplicates.forEach(dup => {
      console.log(`NISN ${dup.nisn} appears ${dup.count} times:`);
      dup.items.forEach(item => {
        console.log(`  Index ${item.originalIndex}: ${item.nama} (${item.kelas}-${item.jurusan})`);
      });
    });
  }

  return duplicates;
}

function main() {
  console.log('Checking for duplicate NISN values in student arrays...\n');

  const siswaKelas10 = extractArray(seedContent, 'siswaKelas10');
  const siswaKelas11 = extractArray(seedContent, 'siswaKelas11');
  const siswaKelas12 = extractArray(seedContent, 'siswaKelas12');

  console.log(`Extracted arrays:`);
  console.log(`- siswaKelas10: ${siswaKelas10.length} items`);
  console.log(`- siswaKelas11: ${siswaKelas11.length} items`);
  console.log(`- siswaKelas12: ${siswaKelas12.length} items`);

  const duplicates10 = checkDuplicates(siswaKelas10, 'siswaKelas10');
  const duplicates11 = checkDuplicates(siswaKelas11, 'siswaKelas11');
  const duplicates12 = checkDuplicates(siswaKelas12, 'siswaKelas12');

  const totalDuplicates = duplicates10.length + duplicates11.length + duplicates12.length;

  console.log(`\n=== SUMMARY ===`);
  console.log(`Total duplicate NISN groups: ${totalDuplicates}`);

  if (totalDuplicates === 0) {
    console.log('✅ No duplicate NISN values found!');
  } else {
    console.log('❌ Duplicate NISN values found. This could cause database insertion issues.');
  }
}

main();