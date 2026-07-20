import React, { useState } from 'react';
import { ChefHat } from 'lucide-react';

export const SafeImage = ({ src, alt, className, placeholderClass = '' }) => {
  const [errored, setErrored] = useState(false);

  const getAssetPath = (path) => {
    if (path && path.startsWith('/')) {
      return `.${path}`;
    }
    return path;
  };

  const resolvedSrc = getAssetPath(src);

  if (!src || errored) {
    return (
      <div className={`${placeholderClass || className} bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center`}>
        <div className="text-center text-stone-400 opacity-60">
          <ChefHat className="w-10 h-10 mx-auto mb-1" />
          <span className="text-[10px] font-medium">No Image</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  );
};
