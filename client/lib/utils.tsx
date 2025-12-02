import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function linkify(text: string): React.ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  text.replace(urlRegex, (match, url, offset) => {
    // Add non-link text before the current link
    if (offset > lastIndex) {
      parts.push(text.substring(lastIndex, offset));
    }
    // Add the link
    parts.push(
      <a 
        key={offset} 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-600 hover:underline"
      >
        {url}
      </a>
    );
    lastIndex = offset + match.length;
    return match;
  });

  // Add any remaining non-link text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

