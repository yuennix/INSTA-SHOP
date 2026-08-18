import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

type ProductName = 'INSTA HI2' | 'INSTA GMAIL';

const products: Array<{
  name: ProductName;
  number: string;
  stock: number;
  category: string;
  description: string;
  className: string;
}> = [
  {
    name: 'INSTA HI2',
    number: '01',
    stock: 2,
    category: 'The direct line',
    description: 'A clear starting point for a quick, considered request.',
    className: 'hi2',
  },
  {
    name: 'INSTA GMAIL',
    number: '02',
    stock: 2,
    category: 'The everyday line',
    description: 'A familiar route, kept simple from first look to next step.',
    className: 'gmail',
  },
];

function Home() {
  const [selectedProduct, setSelectedProduct] = useState<ProductName | null>(null);
  const [contact, setContact] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openRequest = (product: ProductName) => {
    setSelectedProduct(product);
    setContact('');
    setIsConfirmed(false);
  };

  const closeRequest = () => {
    setSelectedProduct(null);
    setIsConfirmed(false);
  };

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contact.trim()) return;
    setIsConfirmed(true);
  };

  useEffect(() => {
    if (!selectedProduct) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRequest();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedProduct]);

  return (
    <main className="shop-page" data-testid="page-insta-shop">
      <div className="grain" aria-hidden="true" />

      <header className="site-header" data-testid="header-shop">
        <button
          className="brand-lockup"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          data-testid="button-scroll-top"
          aria-label="Back to top"
        >
          <span className="brand-mark" aria-hidden="true">I</span>
          <span className="brand-name">INSTA SHOP</span>
        </button>

        <nav className="header-nav" aria-label="Page navigation">
          <button type="button" onClick={() => scrollTo('offerings')} data-testid="button-nav-offerings">
            Offerings
          </button>
          <button type="button" onClick={() => scrollTo('signal')} data-testid="button-nav-note">
            The short version
          </button>
        </nav>

        <div className="header-status" data-testid="status-shop-open">
          <span className="status-dot" aria-hidden="true" />
          Shop open
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">
            Keep it
            <br />
            <em>insta.</em>
          </h1>
          <p className="hero-intro">
            INSTA SHOP is a small, intentional place to find exactly what you came for.
            Pick a line below and we will take it from there.
          </p>
          <div className="business-info" aria-labelledby="business-info-title">
            <p className="business-info-title" id="business-info-title">
              Instagram Account Store — Business Information
            </p>
            <h2>About Us</h2>
            <p>
              We provide uncreated Instagram account for customers who want to create and manage
              their own accounts. Each account is delivered uncreated allowing the buyer to
              complete the setup and password reset process themselves.
            </p>
          </div>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <span className="orbit-label">No<br />noise</span>
        </div>
      </section>

      <section className="products-section" id="offerings" aria-labelledby="offerings-title">
        <div className="section-heading">
          <h2 id="offerings-title">AVAILABLE PRODUCTS</h2>
          <p>One tap to start a clear conversation.</p>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <article
              className={`product-card ${product.className}`}
              key={product.name}
              data-testid={`card-product-${product.className}`}
            >
              <div className="card-topline">
                <span>{product.category}</span>
                <span className="product-number" data-testid={`text-number-${product.className}`}>
                  {product.number}
                </span>
              </div>
              <h3 data-testid={`text-product-${product.className}`}>{product.name}</h3>
              <p className="stock-count" data-testid={`text-stock-${product.className}`}>
                {product.stock} in stock
              </p>
              <p>{product.description}</p>
              <div className="shape" aria-hidden="true" />
              <button
                className="request-button"
                type="button"
                onClick={() => openRequest(product.name)}
                data-testid={`button-request-${product.className}`}
              >
                Request <ArrowUpRight aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="signal-section" id="signal" aria-labelledby="signal-title">
        <div className="signal-inner">
          <p className="signal-kicker">The short version / 02</p>
          <p className="signal-copy" id="signal-title">
            No maze. No <span>maybe.</span> Just the right next step.
          </p>
        </div>
      </section>

      <footer className="footer">
        <p className="footer-note">A focused storefront for quick, trustworthy decisions.</p>
        <p className="footer-meta">INSTA SHOP<br />Two offerings only</p>
      </footer>

      {selectedProduct && (
        <div
          className="dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeRequest();
          }}
          data-testid="dialog-request-backdrop"
        >
          <section
            className="request-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-title"
            data-testid="dialog-request"
          >
            <div className="dialog-header">
              <div>
                <p className="dialog-label">Selected offering</p>
                <h2 id="request-title" data-testid="text-selected-product">{selectedProduct}</h2>
              </div>
              <button
                className="close-dialog"
                type="button"
                onClick={closeRequest}
                aria-label="Close request"
                data-testid="button-close-request"
              >
                <X size={17} aria-hidden="true" />
              </button>
            </div>

            {!isConfirmed ? (
              <>
                <p className="dialog-copy">
                  Share a contact point and we will follow up with the next step.
                  Nothing else is needed here.
                </p>
                <form className="contact-form" onSubmit={submitRequest}>
                  <input
                    type="text"
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    placeholder="Email or preferred contact"
                    aria-label="Email or preferred contact"
                    autoFocus
                    data-testid="input-contact"
                  />
                  <button type="submit" disabled={!contact.trim()} data-testid="button-send-request">
                    Send request
                  </button>
                </form>
              </>
            ) : (
              <div className="confirmation" data-testid="status-request-confirmed">
                <Check className="confirmation-icon" size={22} aria-hidden="true" />
                <p>
                  <strong>Got it.</strong><br />
                  Your request for {selectedProduct} is noted. We will be in touch at {contact}.
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;