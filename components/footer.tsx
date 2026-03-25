import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#2d2016] text-white overflow-hidden">
      {/* Subtle warm glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-[#c8956c]/[0.06] rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto">
        {/* Health Promise */}
        <div className="text-center px-6 pt-16 pb-10">
          <h3
            className="text-2xl sm:text-3xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Dilisshious Health Promise
          </h3>
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-10 bg-[#c8956c]/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8956c]" />
            <span className="h-px w-10 bg-[#c8956c]/40" />
          </div>
          <p className="text-sm text-[#c8956c] italic leading-relaxed max-w-md mx-auto">
            Farm not pharma. Small batches. Real ingredients.
            <br />
            Food that nourishes beyond the plate.
          </p>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center gap-3 sm:gap-4 pb-12">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#c8956c] hover:border-[#c8956c] transition-all duration-300"
            aria-label="Instagram"
          >
            <Instagram size={16} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#c8956c] hover:border-[#c8956c] transition-all duration-300"
            aria-label="Facebook"
          >
            <Facebook size={16} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#c8956c] hover:border-[#c8956c] transition-all duration-300"
            aria-label="Twitter / X"
          >
            <Twitter size={16} />
          </a>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#c8956c] hover:border-[#c8956c] transition-all duration-300"
            aria-label="WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 px-6 py-4 text-center">
        <p className="text-xs text-white/30">
          © {new Date().getFullYear()} Dilisshious. Made with love, in small
          batches.
        </p>
      </div>
    </footer>
  );
}
