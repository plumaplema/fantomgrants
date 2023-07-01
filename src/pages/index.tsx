import { VStack } from '@chakra-ui/react';
import Hero from '@/components/Home/Hero';

export default function Home() {
  return (
    <VStack width={['100%', '90%']} spacing={10}>
      <Hero />
    </VStack>
  );
}