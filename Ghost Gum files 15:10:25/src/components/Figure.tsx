import React from 'react';

interface FigureProps {
  children: React.ReactNode;
  caption?: string;
  provenance?: string;
  className?: string;
}

const Figure: React.FC<FigureProps> = ({ children, caption, provenance, className = '' }) => {
  return (
    <figure className={`relative ${className}`}>
      {children}
      {(caption || provenance) && (
        <figcaption className="mt-4 space-y-2">
          {caption && (
            <p className="text-small text-ink/70 leading-relaxed">
              {caption}
            </p>
          )}
          {provenance && (
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 mt-1 flex-shrink-0">
                <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
                  <path 
                    d="M8 2C6.5 2 5.5 3 5.5 4.5C5.5 6 6.5 7 7.5 8C8.5 9 8.5 10 8.5 11C8.5 12 8.75 13 9 14C9.25 13 9.5 12 9.5 11C9.5 10 9.5 9 10.5 8C11.5 7 12.5 6 12.5 4.5C12.5 3 11.5 2 8 2Z" 
                    fill="#8F7B66" 
                    opacity="0.6"
                  />
                </svg>
              </div>
              <p className="text-small small-caps text-accent font-medium">
                {provenance}
              </p>
            </div>
          )}
        </figcaption>
      )}
    </figure>
  );
};

export default Figure;