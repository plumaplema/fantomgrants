import { VStack, Divider } from '@chakra-ui/react';
import Hero from '@/components/Home/Hero';
import Features from '@/components/Home/Features';
import Upcoming from '@/components/Home/Upcoming';

export default function Home() {
  return (
    <VStack width={['100%', '90%']} spacing={10}>
      <Hero />
      <Divider />
      <Features />
      <Divider />
      <Upcoming />
    </VStack>
  );
}