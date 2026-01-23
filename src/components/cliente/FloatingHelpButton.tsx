'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface FloatingHelpButtonProps {
  storeId: string;
}

export function FloatingHelpButton({ storeId }: FloatingHelpButtonProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (isExpanded) {
      router.push(`/tienda/${storeId}/soporte`);
    } else {
      setIsExpanded(true);
      // Auto-collapse after 5 seconds
      setTimeout(() => setIsExpanded(false), 5000);
    }
  };

  return (
    <Button
      size="lg"
      onClick={handleClick}
      className={`fixed bottom-24 right-4 z-40 rounded-full shadow-lg transition-all duration-300 ${
        isExpanded 
          ? 'h-14 px-6' 
          : 'h-14 w-14 p-0'
      }`}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {isExpanded ? (
        <>
          <HelpCircle className="w-5 h-5 mr-2 shrink-0" />
          <span className="font-semibold whitespace-nowrap">¿Necesitás ayuda?</span>
        </>
      ) : (
        <HelpCircle className="w-6 h-6" />
      )}
    </Button>
  );
}
