import matter from 'gray-matter';
import { promises as fs } from 'fs';

export interface ParsedMarkdown {
  content: string;
  frontmatter: Record<string, unknown>;
  excerpt?: string;
}

export async function parseMarkdown(filePath: string): Promise<ParsedMarkdown> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const { data, content: markdownContent } = matter(content);

    // Extract first paragraph as excerpt
    const paragraphs = markdownContent.split('\n\n').filter(p => p.trim() && !p.startsWith('#'));
    const excerpt = paragraphs[0]?.trim().slice(0, 200);

    return {
      content: markdownContent,
      frontmatter: data,
      excerpt,
    };
  } catch (error) {
    console.error(`Error parsing markdown file ${filePath}:`, error);
    return {
      content: '',
      frontmatter: {},
    };
  }
}

export async function readMarkdownContent(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const { content: markdownContent } = matter(content);
    return markdownContent;
  } catch (error) {
    console.error(`Error reading markdown file ${filePath}:`, error);
    return '';
  }
}
