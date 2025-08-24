import React from 'react';

interface MessageFormatterProps {
  content: string;
  isUser: boolean;
}

const MessageFormatter: React.FC<MessageFormatterProps> = ({ content, isUser }) => {
  // Simple and robust inline text formatting
  const formatInlineText = (text: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    let currentIndex = 0;
    let elementKey = 0;

    // Process text character by character to handle nested formatting
    while (currentIndex < text.length) {
      // Check for bold **text**
      const boldMatch = text.substring(currentIndex).match(/^\*\*([^*]+)\*\*/);
      if (boldMatch) {
        elements.push(
          <strong key={elementKey++} className="font-semibold">
            {boldMatch[1]}
          </strong>
        );
        currentIndex += boldMatch[0].length;
        continue;
      }

      // Check for italic *text* (but not if it's part of **)
      const italicMatch = text.substring(currentIndex).match(/^\*([^*\n]+)\*/);
      if (italicMatch && !text.substring(currentIndex).startsWith('**')) {
        elements.push(
          <em key={elementKey++}>
            {italicMatch[1]}
          </em>
        );
        currentIndex += italicMatch[0].length;
        continue;
      }

      // Check for inline code `text`
      const codeMatch = text.substring(currentIndex).match(/^`([^`]+)`/);
      if (codeMatch) {
        elements.push(
          <code 
            key={elementKey++}
            className={`px-1 py-0.5 rounded text-xs font-mono ${
              isUser 
                ? 'bg-blue-700 text-blue-100' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {codeMatch[1]}
          </code>
        );
        currentIndex += codeMatch[0].length;
        continue;
      }

      // Check for links [text](url)
      const linkMatch = text.substring(currentIndex).match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        elements.push(
          <a 
            key={elementKey++}
            href={linkMatch[2]} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`underline ${
              isUser ? 'text-blue-200 hover:text-blue-100' : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            {linkMatch[1]}
          </a>
        );
        currentIndex += linkMatch[0].length;
        continue;
      }

      // No special formatting found, add regular character
      const nextSpecialChar = text.substring(currentIndex).search(/[\*`\[]/);
      const endIndex = nextSpecialChar === -1 ? text.length : currentIndex + nextSpecialChar;
      
      if (endIndex > currentIndex) {
        const regularText = text.substring(currentIndex, endIndex);
        if (regularText) {
          elements.push(regularText);
        }
        currentIndex = endIndex;
      } else {
        // Single character that didn't match any pattern
        elements.push(text[currentIndex]);
        currentIndex++;
      }
    }

    return elements;
  };

  // Format the message content with basic markdown-like formatting
  const formatMessage = (text: string) => {
    // Split by lines to handle line breaks
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Handle empty lines
      if (line.trim() === '') {
        return <br key={lineIndex} />;
      }

      // Handle headers (# ## ###)
      if (line.match(/^#{1,3}\s/)) {
        const level = line.match(/^(#{1,3})/)?.[1].length || 1;
        const text = line.replace(/^#{1,3}\s/, '');
        const HeaderTag = `h${Math.min(level + 2, 6)}` as keyof JSX.IntrinsicElements;
        return (
          <HeaderTag 
            key={lineIndex} 
            className={`font-bold mb-2 ${
              level === 1 ? 'text-lg' : level === 2 ? 'text-base' : 'text-sm'
            } ${isUser ? 'text-white' : 'text-gray-900'}`}
          >
            {formatInlineText(text)}
          </HeaderTag>
        );
      }

      // Handle bullet points (- or *)
      if (line.match(/^\s*[-*]\s/)) {
        const text = line.replace(/^\s*[-*]\s/, '');
        return (
          <div key={lineIndex} className="flex items-start mb-1">
            <span className={`mr-2 ${isUser ? 'text-white' : 'text-gray-900'}`}>•</span>
            <span className={isUser ? 'text-white' : 'text-gray-900'}>
              {formatInlineText(text)}
            </span>
          </div>
        );
      }

      // Handle numbered lists (1. 2. etc.)
      if (line.match(/^\s*\d+\.\s/)) {
        const match = line.match(/^\s*(\d+)\.\s(.+)/);
        if (match) {
          const [, number, text] = match;
          return (
            <div key={lineIndex} className="flex items-start mb-1">
              <span className={`mr-2 ${isUser ? 'text-white' : 'text-gray-900'}`}>{number}.</span>
              <span className={isUser ? 'text-white' : 'text-gray-900'}>
                {formatInlineText(text)}
              </span>
            </div>
          );
        }
      }

      // Handle code blocks (```)
      if (line.trim().startsWith('```')) {
        return null; // Handle in block processing
      }

      // Regular paragraph
      return (
        <p key={lineIndex} className={`mb-2 ${isUser ? 'text-white' : 'text-gray-900'}`}>
          {formatInlineText(line)}
        </p>
      );
    });
  };


  // Handle code blocks
  const processCodeBlocks = (content: string) => {
    const lines = content.split('\n');
    const result = [];
    let inCodeBlock = false;
    let codeBlockContent = [];
    let codeBlockLanguage = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          // Starting code block
          inCodeBlock = true;
          codeBlockLanguage = line.trim().substring(3);
          codeBlockContent = [];
        } else {
          // Ending code block
          inCodeBlock = false;
          result.push(
            <div key={`code-${i}`} className="my-3">
              <div className={`text-xs px-2 py-1 rounded-t ${
                isUser ? 'bg-blue-700 text-blue-100' : 'bg-gray-200 text-gray-600'
              }`}>
                {codeBlockLanguage || 'code'}
              </div>
              <pre className={`p-3 rounded-b overflow-x-auto text-sm font-mono ${
                isUser ? 'bg-blue-800 text-blue-50' : 'bg-gray-100 text-gray-800'
              }`}>
                <code>{codeBlockContent.join('\n')}</code>
              </pre>
            </div>
          );
          codeBlockContent = [];
        }
      } else if (inCodeBlock) {
        codeBlockContent.push(line);
      } else {
        // Regular line - will be processed by formatMessage
        result.push(line);
      }
    }

    return result;
  };

  // Check if content has code blocks
  if (content.includes('```')) {
    const processedContent = processCodeBlocks(content);
    const codeBlocks = processedContent.filter(item => React.isValidElement(item));
    const textContent = processedContent.filter(item => typeof item === 'string').join('\n');
    
    return (
      <div className="space-y-1">
        {textContent && <div>{formatMessage(textContent)}</div>}
        {codeBlocks}
      </div>
    );
  }

  return <div className="space-y-1">{formatMessage(content)}</div>;
};

export default MessageFormatter;
