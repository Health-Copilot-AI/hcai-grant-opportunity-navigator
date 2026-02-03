'use client';

import Image from 'next/image';

interface FooterProps {
  theme: 'light' | 'dark';
}

export function Footer({ theme }: FooterProps) {
  return (
    <footer className="border-t bg-muted/30 py-4 px-6">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span>Powered by</span>
        <div className="flex items-center gap-1.5">
          <Image
            src={theme === 'dark' ? '/hcai-logo_white_no-text.png' : '/hcai-logo_black_no-text.png'}
            alt="Health Copilot AI"
            width={20}
            height={20}
            className="object-contain"
          />
          <span className="font-medium text-foreground">Health Copilot AI</span>
        </div>
      </div>
    </footer>
  );
}
