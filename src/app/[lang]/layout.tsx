import type { ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Unbounded, Inter_Tight } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import "../components.css";
import { isLocale, locales, hreflang, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/content/config";
import { getDict } from "@/content/dictionaries";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteWidgets } from "@/components/SiteWidgets";
import { PreloaderGate } from "@/components/preloader/PreloaderGate";

/**
 * Runs before hydration: sets up the brand preloader so the hero never flashes
 * and the site always opens even if the client bundle fails.
 *   - repeat session visit  → mark seen so the overlay is hidden from paint
 *   - first visit           → lock scroll + hide hero for the reveal
 *   - failsafe timeout       → force the site open if the client never boots
 */
const PRELOADER_BOOT = `(function(){try{
var d=document.documentElement;
var seen;try{seen=sessionStorage.getItem('sho_pl_seen')==='1';}catch(e){seen=false;}
var rm=false;try{rm=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
if(seen){d.classList.add('sho-seen');return;}
d.classList.add('sho-lock');
if(!rm)d.classList.add('sho-reveal-pending');
setTimeout(function(){
  if(d.classList.contains('sho-ready'))return;
  d.classList.remove('sho-lock','sho-reveal-pending');
  var p=document.getElementById('sho-preloader');
  if(p)p.style.display='none';
},7000);
}catch(e){}})();`;

// Display / headings font.
const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-unbounded",
});

// Body / secondary font.
const interTight = Inter_Tight({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter-tight",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  icons: { icon: "/favicon.svg" },
};

export default function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  if (!isLocale(params.lang)) notFound();
  const locale = params.lang as Locale;
  const dict = getDict(locale);

  const GA4 = process.env.NEXT_PUBLIC_GA4_ID;
  const GTM = process.env.NEXT_PUBLIC_GTM_ID;
  const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang={hreflang[locale]} className={`${interTight.variable} ${unbounded.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_BOOT }} />
        <noscript>
          <style>{`#sho-preloader{display:none!important}html.sho-lock,html.sho-lock body{overflow:auto!important}html.sho-reveal-pending .hero__title,html.sho-reveal-pending .hero__subtitle,html.sho-reveal-pending .hero__actions,html.sho-reveal-pending .hero__bottom{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <PreloaderGate locale={locale} />
        {GTM && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}
          </Script>
        )}
        {GA4 && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4}');`}
            </Script>
          </>
        )}
        {PIXEL && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');`}
          </Script>
        )}

        <a href="#main" className="skip-link">
          {locale === "ua" ? "Перейти до вмісту" : "Skip to content"}
        </a>
        <Header locale={locale} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
        <SiteWidgets locale={locale} />

        {/* Organization + WebSite structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: siteConfig.brand,
                url: siteConfig.siteUrl,
                telephone: siteConfig.phoneDisplay,
                sameAs: [siteConfig.instagram, siteConfig.telegram],
                description: dict.meta.home.description,
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: siteConfig.brand,
                url: siteConfig.siteUrl,
                inLanguage: hreflang[locale],
              },
            ]),
          }}
        />
      </body>
    </html>
  );
}
