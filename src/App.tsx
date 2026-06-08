import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, ChevronUp, Leaf, Droplets, Sparkles, Heart, ShoppingBag, MessageCircle, Star, ChevronLeft, ChevronRight, Store, XIcon } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// --- Types ---
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
}

interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

// --- Data ---
const products: Product[] = [
  // Shea Butter Collection
  { id: 1, name: 'Shea Butter Honey', price: 195, image: '/images/soaps/shea/Shea Butter Honey.png', description: 'A golden treat for thirsty skin (100g) — raw honey and shea butter melt into every pore, leaving you irresistibly soft.' },
  { id: 2, name: 'Shea Butter Aloe Vera', price: 190, image: '/images/soaps/shea/Shea Butter Aloe Vera.png', description: "Nature's hug in a bar (100g) — cool aloe and creamy shea calm, heal, and restore." },
  { id: 3, name: 'Shea Butter Turmeric', price: 200, image: '/images/soaps/shea/Shea Butter Turmeric.png', description: 'Your daily glow ritual (100g) — turmeric and shea work together to brighten and even your skin tone.' },
  { id: 4, name: 'Shea Butter Charcoal', price: 195, image: '/images/soaps/shea/ChatGPT Shea Butter Charcoal.png', description: 'Deep clean, deeply loved (100g) — activated charcoal draws out impurities while shea keeps skin nourished.' },
  { id: 5, name: 'Shea Butter Saffron', price: 220, image: '/images/soaps/shea/Shea Butter saffron.png', description: 'Bathe like royalty (100g) — rare saffron and rich shea butter for skin that truly glows.' },
  { id: 6, name: 'Shea Butter Coffee', price: 200, image: '/images/soaps/shea/Shea Butter Coffee.png', description: 'Wake up your skin (100g) — coffee grounds gently exfoliate while shea butter softens and smooths.' },
  { id: 7, name: 'Shea Butter Goat Milk', price: 250, image: '/images/soaps/shea/Shea Butter Goat Milk.png', description: 'Double the nourishment, double the love (100g) — goat milk and shea butter for deeply fed, velvety skin.' },
  { id: 8, name: 'Shea Butter Rose', price: 200, image: '/images/soaps/shea/Shea Butter Rose.png', description: 'A romance for your skin (100g) — delicate rose and rich shea leave you soft, scented, and glowing.' },
  // Goat Milk Collection
  { id: 10, name: 'Goat Milk Almond', price: 220, image: '/images/organic soaps/Goat milk/Goat Milk Almond.png', description: 'Silky smooth from the very first lather (100g) — almond and goat milk nourish even the most sensitive skin.' },
  { id: 11, name: 'Goat Milk Aloe Vera', price: 190, image: '/images/organic soaps/Goat milk/Goat Milk Aloe Vera.png', description: 'Cool, calm, and cared for (100g) — aloe vera and goat milk soothe irritated skin back to balance.' },
  { id: 12, name: 'Goat Milk Coffee', price: 200, image: '/images/organic soaps/Goat milk/Goat Milk Coffee.png', description: 'Your morning ritual, elevated (100g) — coffee energizes and exfoliates while goat milk keeps skin soft.' },
  { id: 13, name: 'Goat Milk Neem', price: 210, image: '/images/organic soaps/Goat milk/Goat Milk Neem.png', description: "Nature's purifier, bottled in a bar (100g) — neem and goat milk clear, calm, and care for troubled skin." },
  { id: 14, name: 'Goat Milk Turmeric', price: 205, image: '/images/organic soaps/Goat milk/Goat Milk Turmeric.png', description: 'The golden glow secret (100g) — turmeric brightens while goat milk softens for naturally radiant skin.' },
  { id: 15, name: 'Pure Goat Milk Soap', price: 200, image: '/images/organic soaps/Goat milk/Pure Goat Milk.png', description: 'Pure. Gentle. Unforgettable (100g) — nothing but the goodness of goat milk for skin that feels like silk.' },
  // Triple Butter Collection
  { id: 16, name: 'Triple Butter Aloe Vera', price: 190, image: '/images/organic soaps/tripple butter/Triple Butter Aloe Vera.png', description: 'Three butters, one bar, endless softness (100g) — aloe vera meets shea, cocoa, and mango butter for ultimate nourishment.' },
  { id: 17, name: 'Triple Butter Honey', price: 195, image: '/images/organic soaps/tripple butter/Triple Butter Honey.png', description: 'Rich, golden, and deeply moisturizing (100g) — honey and triple butter blend for skin that stays soft all day.' },
  { id: 18, name: 'Triple Butter Turmeric', price: 205, image: '/images/organic soaps/tripple butter/Triple butter Turmeric.png', description: 'Glow, amplified (100g) — turmeric and three powerful butters work together for a radiant, even-toned complexion.' },
  { id: 19, name: 'Triple Butter Saffron', price: 220, image: '/images/organic soaps/tripple butter/tripple butter saffron.png', description: 'Luxury you can feel (100g) — rare saffron and triple butter create an indulgent bar that nourishes and brightens.' },
  { id: 24, name: 'Root Red Lip Balm', price: 115, image: '/images/extra/blush pink lipbalm.png', description: 'A naturally tinted organic balm (8g) for deeply nourished lips and a soft red glow.' },
  { id: 21, name: 'Citrus Glow Bath Salt', price: 180, image: '/images/extra/orange bath salt.png', description: 'Dive into sunshine (100g) — citrus-infused salts revitalize tired skin and uplift your mood with every soak.' },
  { id: 22, name: 'Lavender Calm Shower Gel', price: 300, image: '/images/extra/lavender shower gel.png', description: 'A calming escape in every shower (150ml approx) — lavender lather washes away the day and leaves skin refreshed.' },
  { id: 23, name: 'Ayur Glow Bath Powder', price: 100, image: '/images/extra/bath powder.png', description: 'An ancient ritual, rediscovered (100g) — wild turmeric and green gram gently cleanse, brighten, and soften skin.' },
];

const services: Service[] = [
  { icon: <Sparkles size={28} />, title: 'Bath Salt', description: 'Gentle and effective, our organic bath salt cleanses while nourishing the skin with all-natural ingredients.', image: '/images/bath/orange bath salt.png' },
  { icon: <Heart size={28} />, title: 'Lip Balm', description: 'A naturally tinted organic balm for deeply nourished lips and a soft red glow.', image: '/images/service/blush pink lipbalm.png' },
  { icon: <Droplets size={28} />, title: 'Shower Gel', description: 'Luxurious shower gel delivers a smooth lather that leaves your skin feeling refreshed and hydrated.', image: '/images/bath/lavender shower gel.png' },
  { icon: <Leaf size={28} />, title: 'Bath Powder', description: 'Relax and unwind with our natural bath powder. Removing dirt & excess oil, keeping skin soft & supple.', image: '/images/bath/bath powder.png' },
  { icon: <Heart size={28} />, title: 'Organic Soaps', description: 'Handcrafted organic soaps made with organic extracts for refreshed and hydrated skin.', image: '/images/soaps/shea/Shea Butter saffron.png' },
];

const testimonials: Testimonial[] = [
  { name: 'Priya S.', rating: 5, text: 'The Shea Butter soap has transformed my skin! It feels so soft and moisturized.' },
  { name: 'Anita K.', rating: 5, text: 'Love the natural ingredients. My family has switched to Body Bloomer by Remya completely!' },
  { name: 'Rahul M.', rating: 5, text: 'The Coffee soap is amazing. Great lather and smells fantastic.' },
];

const galleryImages = [
  '/images/gallery pic.png',
  '/images/hamper.png',
  '/images/logo.png',
  '/images/gallery pic (2).png',
];

const WHATSAPP_NUMBER = '918848737295';

// --- Components ---

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
}

function Navbar({ cartCount, wishlistCount, onCartClick, onWishlistClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Products', href: '#products' },
    { name: 'Services', href: '#services' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-white shadow-sm'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="#home" className="text-xl font-bold text-primary">Body Bloomer by Remya</a>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-dark hover:text-primary font-medium transition-colors">
                {link.name}
              </a>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Services Icon */}
            <a 
              href="#services" 
              className="flex flex-col items-center text-dark hover:text-primary transition-colors"
              title="Services"
            >
              <Store size={22} />
              <span className="text-xs mt-0.5 hidden md:block">Services</span>
            </a>
            
            {/* Wishlist Icon */}
            <button 
              onClick={onWishlistClick}
              className="flex flex-col items-center text-dark hover:text-primary transition-colors relative"
              title="Wishlist"
            >
              <Heart size={22} />
              <span className="text-xs mt-0.5 hidden md:block">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>
            
            {/* Cart Icon */}
            <button 
              onClick={onCartClick}
              className="flex flex-col items-center text-dark hover:text-primary transition-colors relative"
              title="Cart"
            >
              <ShoppingBag size={22} />
              <span className="text-xs mt-0.5 hidden md:block">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden bg-white rounded-lg shadow-lg mt-2 py-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-4 py-3 text-dark hover:bg-light hover:text-primary font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2 px-4 flex justify-around">
              <a href="#services" className="flex flex-col items-center text-dark" onClick={() => setIsOpen(false)}>
                <Store size={20} />
                <span className="text-xs">Services</span>
              </a>
              <button onClick={() => { onWishlistClick(); setIsOpen(false); }} className="flex flex-col items-center text-dark relative">
                <Heart size={20} />
                <span className="text-xs">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <button onClick={() => { onCartClick(); setIsOpen(false); }} className="flex flex-col items-center text-dark relative">
                <ShoppingBag size={20} />
                <span className="text-xs">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function Hero() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);

  const slides = [
    {
      title: 'Nourish Your Skin with Nature\'s Best',
      subtitle: 'Handcrafted organic soaps, shower gels, bath salts, bath powder, and tinted lip balm made with certified ingredients to hydrate, soothe, and rejuvenate your skin.',
      image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=800&h=600&fit=crop'
    },
    {
      title: 'Pure Ingredients, Beautiful Skin',
      subtitle: 'Discover naturally radiant skin through our handcrafted rituals, from organic soaps to glow-boosting lip care.',
      image: 'https://images.unsplash.com/photo-1607006412363-d4f52a5095d1?w=800&h=600&fit=crop'
    },
    {
      title: 'Our Commitment to Pure, Natural Skincare',
      subtitle: 'No harmful chemicals, no synthetic additives, just the pure power of nature.',
      image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&h=600&fit=crop'
    }
  ];

  return (
    <section id="home" className="relative min-h-[auto] md:min-h-screen flex items-center pt-20 pb-8 md:pt-16">
      <div className="max-w-6xl mx-auto px-4 w-full">
        <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0">
                <div className="relative bg-gradient-to-br from-light to-accent rounded-2xl overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-center p-4 md:p-8 lg:p-12">
                    <div className="order-2 md:order-1">
                      <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-dark mb-2 md:mb-4 leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-4 md:mb-6">{slide.subtitle}</p>
                      <a
                        href="#products"
                        className="inline-flex items-center gap-2 bg-primary text-white px-4 sm:px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold hover:bg-dark transition-colors shadow-lg text-sm md:text-base"
                      >
                        <ShoppingBag size={18} />
                        Shop Now
                      </a>
                    </div>
                    <div className="order-1 md:order-2">
                      <img src={slide.image} alt={slide.title} className="rounded-xl shadow-2xl w-full h-40 sm:h-48 md:h-64 lg:h-80 object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ProductCarouselProps {
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onOpenCart: () => void;
}

function ProductCarousel({ onAddToCart, onAddToWishlist, onOpenCart }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi]);

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <section id="products" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-xl mx-auto">From artisanal soaps to nourishing lip care, each product is handcrafted with the finest organic ingredients.</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {products.map((product) => (
                <div key={product.id} className="flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0 px-2">
                  <div className="bg-light rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                    <div className="relative h-48 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-dark mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">Rs. {product.price}/-</span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            addedToCart === product.id 
                              ? 'bg-green-500 text-white' 
                              : 'bg-primary text-white hover:bg-dark'
                          }`}
                        >
                          {addedToCart === product.id ? 'Added!' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white shadow-lg rounded-full p-2 hover:bg-primary hover:text-white transition-colors z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white shadow-lg rounded-full p-2 hover:bg-primary hover:text-white transition-colors z-10"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="text-center mt-8">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello! I'm interested in your organic skincare products.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors shadow-lg"
          >
            <MessageCircle size={20} />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const [selected, setSelected] = useState<number | null>(1);

  return (
    <section id="services" className="py-16 bg-accent/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Premium organic skincare solutions for every need</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 group h-64 ${selected === index ? 'ring-2 ring-primary' : 'hover:shadow-lg'}`}
              onClick={() => setSelected(selected === index ? null : index)}
            >
              {/* Background Image */}
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              {/* Selected Badge */}
              {selected === index && (
                <div className="absolute top-3 right-3 bg-white/90 text-dark text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Selected
                </div>
              )}
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-lg mb-1">{service.title}</h3>
                <p className={`text-sm text-white/90 transition-all duration-300 ${selected === index ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 lg:opacity-100 lg:max-h-20'}`}>
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section className="py-16 bg-primary text-white rounded-3xl mx-4 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Commitment to Pure, Natural Skincare</h2>
        <p className="text-lg opacity-90 mb-8">
          At Body Bloomer by Remya, we are passionate about bringing you the very best in organic skincare. Every product we create is handcrafted with care, using only certified organic ingredients to nourish and protect your skin. We believe in simplicity, no harmful chemicals, no synthetic additives, just the pure power of nature.
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2">
            <Leaf className="text-accent" />
            <span>100% Organic</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="text-accent" />
            <span>Cruelty Free</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent" />
            <span>Handcrafted</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-16 bg-light">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">What Our Customers Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
              <p className="font-semibold text-dark">— {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Our Gallery</h2>
          <p className="text-gray-600">Bath essentials made using organic products</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {galleryImages.map((image, index) => (
            <div key={index} className="relative aspect-[16/10] rounded-xl overflow-hidden group">
              <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Name: ${formData.name}%0AQuestion: ${formData.message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
    setSubmitted(true);
    setFormData({ name: '', message: '' });
  };

  return (
    <section id="contact" className="py-16 bg-accent/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Get in Touch</h2>
          <p className="text-gray-600">Have questions? We're here to help!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="font-bold text-xl text-dark mb-4">Ask a Question</h3>
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-green-500 mb-4">
                  <MessageCircle size={48} className="mx-auto" />
                </div>
                <p className="text-gray-600">Redirecting you to WhatsApp...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <textarea
                  placeholder="Your Question"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary h-32 resize-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-dark transition-colors"
                >
                  Send via WhatsApp
                </button>
              </form>
            )}
          </div>

          <div className="space-y-4">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello! I'm interested in your organic skincare products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-green-500 text-white p-4 rounded-xl hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={24} />
              <div>
                <p className="font-semibold">Chat on WhatsApp</p>
                <p className="text-sm opacity-90">Quick response guaranteed</p>
              </div>
            </a>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md">
              <div className="bg-primary/10 p-3 rounded-full">
                <ShoppingBag className="text-primary" size={24} />
              </div>
              <div>
                <p className="font-semibold text-dark">Free Shipping</p>
                <p className="text-sm text-gray-600">On orders above Rs. 500</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md">
              <div className="bg-primary/10 p-3 rounded-full">
                <Heart className="text-primary" size={24} />
              </div>
              <div>
                <p className="font-semibold text-dark">100% Natural</p>
                <p className="text-sm text-gray-600">Certified organic ingredients</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

function CartSidebar({ isOpen, onClose, cartItems, onRemoveItem, onCheckout }: CartSidebarProps) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium text-dark">Item added to your cart</span>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-dark text-sm">{item.name}</h4>
                      <p className="text-primary font-bold mt-1">Rs. {item.price}/-</p>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-3">
              <button 
                onClick={() => { onClose(); window.location.href = '#products'; }}
                className="w-full py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors"
              >
                View cart ({totalItems})
              </button>
              <button 
                onClick={onCheckout}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-dark transition-colors"
              >
                Checkout securely
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Body Bloomer by Remya</h3>
            <p className="text-gray-400">Handcrafted organic skincare products made with love and nature's finest ingredients.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">WhatsApp: +91 88487 37295</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Body Bloomer by Remya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-dark transition-all duration-300 z-50 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <ChevronUp size={24} />
    </button>
  );
}

// --- Main App ---
function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const handleAddToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const handleCheckout = () => {
    const message = cart.map(item => `${item.name} (Qty: ${item.quantity}) - Rs. ${item.price * item.quantity}/-`).join('%0A');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I'd like to order:%0A${message}%0A%0ATotal: Rs. ${total}/-`, '_blank');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-light">
      <Navbar 
        cartCount={cartCount} 
        wishlistCount={wishlist.length}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
      />
      <Hero />
      <ProductCarousel 
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        onOpenCart={() => setIsCartOpen(true)}
      />
      <Services />
      <Mission />
      <Testimonials />
      <Gallery />
      <Contact />
      <Footer />
      <BackToTop />
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export default App;
