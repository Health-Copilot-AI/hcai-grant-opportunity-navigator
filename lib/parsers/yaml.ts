import yaml from 'js-yaml';
import { promises as fs } from 'fs';

export async function parseYAML<T = unknown>(filePath: string): Promise<T | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return yaml.load(content) as T;
  } catch (error) {
    console.error(`Error parsing YAML file ${filePath}:`, error);
    return null;
  }
}

export function parseYAMLString<T = unknown>(content: string): T | null {
  try {
    return yaml.load(content) as T;
  } catch (error) {
    console.error('Error parsing YAML string:', error);
    return null;
  }
}
