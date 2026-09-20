'use client';

import { motion } from 'framer-motion';

export default function EchoStack() {
  const text = 'GITWORLD';

  const layers = [
    { bg: '#d9d9d9', offset: '-0.16em' },
    { bg: '#d1d1d1', offset: '-0.12em' },
    { bg: '#c9c9c9', offset: '-0.08em' },
    { bg: '#bfbfbf', offset: '-0.04em' },
  ];

  return (
    <div className="relative inline-block select-none py-6">
      {/* Background Echo Layers 2 to 5 (shifted up and left) */}
      {layers.map((layer, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="absolute top-0 left-0 w-full pointer-events-none font-clash font-extrabold uppercase tracking-[-0.05em] leading-[0.85] text-[11vw] lg:text-[170px]"
          style={{
            color: layer.bg,
            transform: `translate(${layer.offset}, ${layer.offset})`,
            zIndex: index + 1,
          }}
        >
          {text}
        </div>
      ))}

      {/* Top Main Layer (Foreground) */}
      <h1 className="relative z-10 font-clash font-extrabold uppercase tracking-[-0.05em] leading-[0.85] text-[11vw] lg:text-[170px] text-[#111111]">
        {text}
      </h1>
    </div>
  );
}
