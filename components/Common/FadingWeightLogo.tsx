import { useRouter } from 'next/navigation';
import React from 'react';

interface FadingWeightLogoProps {
  text: string;
  maxWeight?: number;
  minWeight?: number;
  step?: number;
}

export const FadingWeightLogo: React.FC<FadingWeightLogoProps> = ({
  text,
  maxWeight = 900,
  minWeight = 300,
  step = 100,
}) => {
  const length = text.length;
  const weights = Array.from({ length }, (_, i) =>
    Math.max(minWeight, maxWeight - i * step)
  );
 const router = useRouter();
  return (
    <span style={{ display: 'inline-flex', gap: 1 , marginRight: '10px'}} onClick={()=>  router.push("/")}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={{
            fontWeight: weights[index],
            fontSize: '2rem',
            transition: 'font-weight 0.3s',
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};
