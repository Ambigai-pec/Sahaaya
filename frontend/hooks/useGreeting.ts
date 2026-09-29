import { useState, useEffect } from 'react';

export function useGreeting(name: string) {
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(`Good Morning, ${name} 👋`);
    else if (hour < 18) setGreeting(`Good Afternoon, ${name} 👋`);
    else setGreeting(`Good Evening, ${name} 👋`);
  }, [name]);
  
  return greeting;
}
