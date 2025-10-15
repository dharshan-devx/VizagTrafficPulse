
export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const quickLinks = [
    { id: "about", label: "About" },
    { id: "methodology", label: "Methodology" },
    { id: "results", label: "Results" },
    { id: "impact", label: "Impact" },
  ];


  return (
    <footer className="py-20 modern-footer-bg relative overflow-hidden">
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12 mb-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="text-4xl font-black mb-6">
                <span className="text-white">Vizag</span>
                <span className="text-blue-400">Traffic</span>
                <span className="text-purple-400">Pulse</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed" data-testid="footer-description">
                Revolutionizing urban traffic management through predictive analytics and machine learning for smarter, safer cities.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white" data-testid="footer-quick-links-title">Quick Links</h3>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="modern-footer-link text-gray-300 hover:text-white transition-all duration-300"
                      data-testid={`footer-link-${link.id}`}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>


          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-600/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-center md:text-left" data-testid="footer-copyright">
                © 2025 Vizag Traffic Pulse. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
