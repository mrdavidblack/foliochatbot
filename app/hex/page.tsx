import Link from "next/link";
import Image from "next/image";
import { MapPin, Instagram, Facebook, Mail, Phone, ExternalLink } from "lucide-react";

export const metadata = {
  title: "HEX | Clifton Hill",
  description: "HEX Bar – 123 Queens Parade, Clifton Hill, MELB VIC",
};

export default function HexPage() {
  return (
    <div className="min-h-screen bg-black text-neutral-200">
      <header className="border-b border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">HEX</h1>
              <p className="mt-2 text-sm text-neutral-400">123 Queens Parade, Clifton Hill, MELB VIC</p>
              <p className="mt-4 max-w-2xl text-neutral-300">
                A neighborhood cocktail bar celebrating classic technique, seasonal ingredients, and vinyl nights.
                Settle in for intimate booths, low lighting, and a curated list of house creations.
              </p>
            </div>
            <nav aria-label="Primary" className="hidden gap-6 text-sm md:flex">
              <a href="#photos" className="text-neutral-300 hover:text-white">Photos</a>
              <a href="#menu" className="text-neutral-300 hover:text-white">Menu</a>
              <a href="#instagram" className="text-neutral-300 hover:text-white">Instagram</a>
            </nav>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-neutral-300">
            <div className="flex items-center gap-2"><MapPin size={16} /> <span>Clifton Hill</span></div>
            <div className="flex items-center gap-2"><Phone size={16} /> <a className="hover:text-white" href="tel:+61000000000">+61 000 000 000</a></div>
            <div className="flex items-center gap-2"><Mail size={16} /> <a className="hover:text-white" href="mailto:hello@hex.bar">hello@hex.bar</a></div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <section id="photos" aria-labelledby="photos-heading" className="scroll-mt-24">
          <h2 id="photos-heading" className="mb-6 text-xl font-medium text-white">Photos</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c76a2?q=80&w=1200&auto=format&fit=crop",
                alt: "Bartender pouring cocktail into coupe glass",
              },
              {
                src: "https://images.unsplash.com/photo-1542219550-37153d387c47?q=80&w=1200&auto=format&fit=crop",
                alt: "Dimly lit bar interior with bottles on shelves",
              },
              {
                src: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop",
                alt: "Cocktail with citrus garnish on a black bar top",
              },
              {
                src: "https://images.unsplash.com/photo-1536935339748-95f7dd064d71?q=80&w=1200&auto=format&fit=crop",
                alt: "Close-up of a stirred cocktail with large ice cube",
              },
            ].map((img, i) => (
              <div key={i} className="overflow-hidden rounded-md border border-neutral-800">
                {/* Using next/image for optimization; alt text provided */}
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={400}
                  className="h-48 w-full object-cover sm:h-56 md:h-48"
                />
              </div>
            ))}
          </div>
        </section>

        <section id="menu" aria-labelledby="menu-heading" className="mt-12 scroll-mt-24">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="menu-heading" className="text-xl font-medium text-white">Cocktail Menu</h2>
            <Link href="#" className="inline-flex items-center gap-2 text-sm text-neutral-300 hover:text-white">
              Download PDF <ExternalLink size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { name: "Black Moon", desc: "Gin, blackberry, lemon, rosemary, soda", price: "$20" },
              { name: "Neon Old Fashioned", desc: "Rye, house neon syrup, bitters", price: "$22" },
              { name: "Shadow Spritz", desc: "Amaro, blood orange, bubbles", price: "$18" },
              { name: "Velvet Martini", desc: "Vodka, cacao, espresso, vanilla", price: "$21" },
              { name: "Clifton Sour", desc: "Whisky, lemon, red wine float", price: "$19" },
            ].map((item) => (
              <article key={item.name} className="rounded-md border border-neutral-800 bg-neutral-950 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-medium text-white">{item.name}</h3>
                    <p className="mt-1 text-sm text-neutral-300">{item.desc}</p>
                  </div>
                  <div className="shrink-0 text-sm text-neutral-200">{item.price}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="instagram" aria-labelledby="instagram-heading" className="mt-12 scroll-mt-24">
          <h2 id="instagram-heading" className="mb-6 text-xl font-medium text-white">Instagram</h2>
          <p className="mb-4 text-sm text-neutral-400">
            Mock feed. Live embeds typically require oEmbed or a third-party widget.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1200&auto=format&fit=crop",
                caption: "Friday vinyl nights start at 8pm.",
                href: "https://instagram.com",
              },
              {
                img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
                caption: "New autumn menu now pouring.",
                href: "https://instagram.com",
              },
              {
                img: "https://images.unsplash.com/photo-1540097934525-14b45b3b8b39?q=80&w=1200&auto=format&fit=crop",
                caption: "Private booth bookings available.",
                href: "https://instagram.com",
              },
            ].map((post, i) => (
              <article key={i} className="overflow-hidden rounded-md border border-neutral-800">
                <Image src={post.img} alt={post.caption} width={600} height={400} className="h-52 w-full object-cover" />
                <div className="flex items-start justify-between gap-4 p-3">
                  <p className="text-sm text-neutral-200">{post.caption}</p>
                  <Link href={post.href} target="_blank" rel="noreferrer" className="shrink-0 text-neutral-300 hover:text-white">
                    <ExternalLink size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-white">HEX</p>
              <p className="text-sm text-neutral-400">123 Queens Parade, Clifton Hill, MELB VIC</p>
            </div>
            <div className="flex items-center gap-4 text-neutral-300">
              <Link href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white">
                <Instagram />
              </Link>
              <Link href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-white">
                <Facebook />
              </Link>
              <Link href="mailto:hello@hex.bar" aria-label="Email" className="hover:text-white">
                <Mail />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


