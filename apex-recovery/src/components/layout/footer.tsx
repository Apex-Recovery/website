import React from 'react';
import {Link} from 'wouter';
import {Github, Twitter} from 'lucide-react';
import {SiAndroid} from 'react-icons/si';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm py-16 md:py-20 mt-0">
      <div className="container mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between gap-12">
        <div className="max-w-xs space-y-5">
          <div className="flex flex-col items-start gap-3">
            <img
              src="/logo.png"
              alt="Apex Recovery"
              className="h-48 w-48 object-contain"
            />
            <span className="font-display font-bold text-xl tracking-tight">
              Apex Recovery
            </span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The next-generation Android custom recovery. Built by the community,
            for the community. Site licensed under GPL v3; recovery under Apache 2.0.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <a
              href="https://github.com/Apex-Recovery"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-xl bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
            >
              <SiAndroid className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-xl bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 sm:gap-14">
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">
              Project
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/downloads"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Downloads
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Apex-Recovery"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Source Code
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">
              Community
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://discord.gg/4Z6v2EeggZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4 col-span-2 md:col-span-1">
            <h4 className="font-display font-semibold text-foreground text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://www.gnu.org/licenses/gpl-3.0.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  GPL v3 License
                </a>
              </li>
              <li>
                <a
                  href="https://www.apache.org/licenses/LICENSE-2.0.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Apache 2.0 License
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Apex Recovery Project. Not affiliated
          with Google LLC or Android Open Source Project.
        </p>
      </div>
    </footer>
  );
}
