import React from "react";

export default function SeoHead() {
  return (
    <>
      {/* Google Search Console */}
      <meta name="google-site-verification" content="d1FqYJpmpgp0wB8Gea14miRwXziTB4zpF4wkba-F7rc" />
      {/* Google Analytics */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-XND4426E2W"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XND4426E2W');
          `,
        }}
      />
    </>
  );
} 