import '../styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <title>CowTag</title>
        {/* Tailwind vía CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
