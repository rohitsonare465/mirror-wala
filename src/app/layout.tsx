import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";

// Premium Typography setup
const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// App Base URL for Canonical links
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mirrorwala.com";

// Rich Production SEO Metadata targeting indore and premium keywords
export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Mirrorwala | Premium LED & Designer Mirrors in Indore",
    template: "%s | Mirrorwala",
  },
  description: "Reflect luxury with Mirrorwala. Handcrafted designer mirrors, customizable smart LED mirrors, and art mirrors near Dewas Naka, Indore. Custom sizes & premium quality.",
  keywords: [
    "Designer mirrors in Indore",
    "LED mirror Indore",
    "Luxury mirrors",
    "Custom mirror near Dewas Naka",
    "Premium decorative mirrors",
    "Mirror customisation Indore",
    "Smart bathroom mirrors",
    "Art mirrors India"
  ],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Mirrorwala | Premium LED & Designer Mirrors in Indore",
    description: "Reflect luxury with Mirrorwala. Handcrafted designer mirrors, customizable smart LED mirrors, and art mirrors near Dewas Naka, Indore. Custom sizes & premium quality.",
    url: APP_URL,
    siteName: "Mirrorwala",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1000,
        height: 1000,
        alt: "Mirrorwala Premium Designer Mirrors Showroom",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mirrorwala | Premium LED & Designer Mirrors in Indore",
    description: "Discover luxury customizable LED & handcrafted designer mirrors near Dewas Naka, Indore. Built premium.",
    images: ["/images/logo.jpg"],
    creator: "@mirrorwala",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Indore Local Business JSON-LD Schema Markup
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mirrorwala",
    "image": `${APP_URL}/images/logo.jpg`,
    "@id": `${APP_URL}/#localbusiness`,
    "url": APP_URL,
    "telephone": "+919111256684",
    "priceRange": "₹₹₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Plot No 4, near Dewas Naka, Sector A, Industrial Area",
      "addressLocality": "Indore",
      "addressRegion": "Madhya Pradesh",
      "postalCode": "452010",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.7562,
      "longitude": 75.8943
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "10:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://www.instagram.com/mirrorwala"
    ]
  };

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to performance asset gateways */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.razorpay.com" crossOrigin="anonymous" />
        
        {/* Injected Local Business JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />

        {/* Global Google Analytics script */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Global Meta Pixel script */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-stone-950 font-sans text-stone-200">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

