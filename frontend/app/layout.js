import './globals.css';
import { CartProvider } from '../lib/cartContext';
import Navbar from '../components/Navbar';
import Marquee from '../components/Marquee';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import AIAssistantModal from '../components/AIAssistantModal';

export const metadata = {
  title: 'StyleLens | Haute Lunetterie & Premium Eyewear',
  description: 'Discover luxury handcrafted sunglasses and eyewear. Featuring 24K gold accents, Italian bio-acetate, and aerospace polarized lenses.',
  keywords: 'StyleLens, luxury sunglasses, premium eyewear, polarized aviators, Italian acetate glasses, designer eyewear India',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#0A0A0A] text-white selection:bg-[#C9A227] selection:text-black">
        <CartProvider>
          <Marquee />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <CartDrawer />
          <AIAssistantModal />
        </CartProvider>
      </body>
    </html>
  );
}
