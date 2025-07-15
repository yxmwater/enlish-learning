import { Word } from '../types';

export async function parseTextFile(file: File): Promise<Word[]> {
  const text = await file.text();
  const words: Word[] = [];
  
  // Split by lines and process each line
  const lines = text.split('\n').filter(line => line.trim());
  
  lines.forEach((line, index) => {
    // Support different formats:
    // 1. Simple word list: apple
    // 2. Word with translation: apple - 苹果
    // 3. Word with pronunciation: apple [ˈæpl]
    // 4. Full format: apple - 苹果 [ˈæpl]
    
    const parts = line.split(/[-–—]/);
    const english = parts[0].trim();
    
    if (english) {
      const word: Word = {
        id: `file-${index}-${Date.now()}`,
        english: english.replace(/\[.*?\]/, '').trim(),
        level: 'beginner' // Default level
      };
      
      // Extract pronunciation if present
      const pronunciationMatch = line.match(/\[(.*?)\]/);
      if (pronunciationMatch) {
        word.pronunciation = pronunciationMatch[1];
      }
      
      // Extract Chinese translation if present
      if (parts.length > 1) {
        word.chinese = parts[1].replace(/\[.*?\]/, '').trim();
      }
      
      words.push(word);
    }
  });
  
  return words;
}

export async function parseJsonFile(file: File): Promise<Word[]> {
  const text = await file.text();
  try {
    const data = JSON.parse(text);
    
    // Handle array of words
    if (Array.isArray(data)) {
      const words: Word[] = [];
      data.forEach((item, index) => {
        if (typeof item === 'string') {
          words.push({
            id: `json-${index}-${Date.now()}`,
            english: item,
            level: 'beginner'
          });
        } else if (typeof item === 'object' && item.english) {
          words.push({
            id: item.id || `json-${index}-${Date.now()}`,
            english: item.english,
            chinese: item.chinese || undefined,
            pronunciation: item.pronunciation || undefined,
            level: item.level || 'beginner',
            category: item.category || undefined
          });
        }
      });
      return words;
    }
    
    // Handle object with words property
    if (data.words && Array.isArray(data.words)) {
      return parseJsonFile(new File([JSON.stringify(data.words)], 'words.json'));
    }
    
    return [];
  } catch (error) {
    console.error('Failed to parse JSON file:', error);
    return [];
  }
}

export async function parseCsvFile(file: File): Promise<Word[]> {
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  const words: Word[] = [];
  
  // Skip header if present
  const startIndex = lines[0].toLowerCase().includes('english') ? 1 : 0;
  
  for (let i = startIndex; i < lines.length; i++) {
    const parts = lines[i].split(',').map(part => part.trim().replace(/^"|"$/g, ''));
    
    if (parts[0]) {
      words.push({
        id: `csv-${i}-${Date.now()}`,
        english: parts[0],
        chinese: parts[1],
        pronunciation: parts[2],
        level: (parts[3] as any) || 'beginner',
        category: parts[4]
      });
    }
  }
  
  return words;
}

export async function parseFile(file: File): Promise<Word[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'txt':
      return parseTextFile(file);
    case 'json':
      return parseJsonFile(file);
    case 'csv':
      return parseCsvFile(file);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}