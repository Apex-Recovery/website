import React, {useEffect, useState} from 'react';
import {Link} from 'wouter';
import {motion} from 'framer-motion';
import {
  TerminalSquare,
  Zap,
  Shield,
  Cpu,
  RefreshCw,
  Smartphone,
  ChevronRight,
  Github,
  ArrowRight,
} from 'lucide-react';
import {Button} from '@/components/ui/button';

// ---------------------------------------------------------------------------
// Terminal animation data
// ---------------------------------------------------------------------------

type LineType = 'cmd' | 'ok' | 'success' | 'progress' | 'dim' | 'info' | 'empty';

interface TerminalLine {
  text: string;
  type: LineType;
}

const TERMINAL_LINES: TerminalLine[] = [
  {text: '$ adb reboot bootloader', type: 'cmd'},
  {text: '* daemon started successfully', type: 'dim'},
  {text: 'Rebooting device...', type: 'info'},
  {text: '', type: 'empty'},
  {text: '$ fastboot flash recovery apex_recovery.img', type: 'cmd'},
  {text: "Sending 'recovery' <32768 KB>...", type: 'progress'},
  {text: 'OKAY [  0.370s ]', type: 'ok'},
  {text: "Writing 'recovery'...", type: 'progress'},
  {text: 'OKAY [  0.710s ]', type: 'ok'},
  {text: 'Finished. Total time: 1.080s', type: 'success'},
];

const LINE_CLASS: Record<LineType, string> = {
  cmd: 'text-foreground font-semibold',
  ok: 'text-accent',
  success: 'text-accent font-semibold',
  progress: 'text-primary/80',
  dim: 'text-muted-foreground/60',
  info: 'text-muted-foreground',
  empty: '',
};

/**
 * Animates terminal output line-by-line.
 *
 * Two separate effects are intentional:
 *   1. Line progression — advances `visibleLines` on a per-line delay that
 *      differs for empty lines (shorter pause) vs. content lines.
 *   2. Cursor blink — runs independently of line state so the blink interval
 *      never resets when a new line appears.
 */
function TerminalWindow() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    if (visibleLines >= TERMINAL_LINES.length) return;
    const delay = TERMINAL_LINES[visibleLines].type === 'empty' ? 150 : 320;
    const timer = setTimeout(() => setVisibleLines((n) => n + 1), delay);
    return () => clearTimeout(timer);
  }, [visibleLines]);

  useEffect(() => {
    const timer = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/15 rounded-3xl blur-2xl opacity-60" />
      <div className="relative rounded-2xl border border-border/60 bg-[#0d0d12] shadow-2xl overflow-hidden font-mono text-sm">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-[#111118]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-auto text-xs text-muted-foreground/50 select-none">
            apex-recovery — bash
          </span>
        </div>
        <div className="p-5 space-y-1 min-h-[280px]">
          {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className={`leading-relaxed ${LINE_CLASS[line.type]}`}
            >
              {/* Use a non-breaking space so empty lines keep their height. */}
              {line.text || '\u00A0'}
            </div>
          ))}
          {visibleLines < TERMINAL_LINES.length && (
            <span
              className={`inline-block w-2 h-4 bg-primary align-middle transition-opacity ${
                cursorVisible ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Static page data
// ---------------------------------------------------------------------------

const STATS = [
  {label: 'Android versions', value: '10–17'},
  {label: 'Partition schemes', value: 'A/B / A'},
];

const FEATURES = [
  {
    icon: <TerminalSquare />,
    title: 'Modern M3 Interface',
    desc: 'Rebuilt from scratch with Material 3 Expressive design, spring animations, and a layout that actually makes sense.',
  },
  {
    icon: <Shield />,
    title: 'Seamless Decryption',
    desc: 'Auto-mount and decrypt AOSP, Lineage, and stock ROMs. Out-of-the-box FBEv2 keystore support.',
  },
  {
    icon: <Zap />,
    title: 'Lightning-Fast Flashing',
    desc: 'Optimized I/O cuts flash times by up to 30%. ADB sideloading is more robust than ever.',
  },
  {
    icon: <RefreshCw />,
    title: 'OTA Survival',
    desc: 'Smart OTA scripting keeps your recovery and root intact across seamless A/B partition updates.',
  },
  {
    icon: <Cpu />,
    title: 'Advanced Partition Manager',
    desc: 'Resize, wipe, repair, or back up logical partitions with a few taps. Full dynamic partition control.',
  },
  {
    icon: <Smartphone />,
    title: 'Wide Device Support',
    desc: 'A unified device tree architecture makes porting to new Snapdragon and MediaTek SoCs fast and clean.',
  },
];

const COMPARISON = [
  {
    title: 'Built for Android 14+',
    desc: 'Apex assumes dynamic partitions and complex A/B slotting are the default — not an afterthought bolted onto a 2011 codebase.',
  },
  {
    title: 'Zero-Lag UI',
    desc: 'Hardware-accelerated rendering eliminates the notorious 15 fps touch lag. Instant response, smooth scrolling.',
  },
  {
    title: 'Cleaner Codebase',
    desc: "Years of legacy bloat stripped out. A leaner, safer foundation that's actually enjoyable to port and maintain.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {transition: {staggerChildren: 0.08}},
};

const itemVariants = {
  hidden: {opacity: 0, y: 20},
  visible: {opacity: 1, y: 0, transition: {duration: 0.5, ease: 'easeOut'}},
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export function Home() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative w-full overflow-hidden pt-24 pb-20 md:pt-36 md:pb-28">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-primary/15 rounded-full blur-[130px] opacity-60 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-accent/15 rounded-full blur-[100px] opacity-40 pointer-events-none mix-blend-screen" />

        <div className="container relative z-10 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-start"
            >
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-6xl xl:text-7xl font-display font-bold tracking-tight text-foreground leading-[1.05] mb-6"
              >
                The Next-Gen
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent">
                  Android Recovery
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed"
              >
                Fast, stable, and built for modern Android. Apex brings a
                Material 3 interface, seamless decryption, and total device
                control — where TWRP left off.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-start gap-3"
              >
                <Button
                  asChild
                  size="lg"
                  className="h-13 px-8 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_50px_-12px_hsl(var(--primary))] transition-all hover:shadow-[0_0_60px_-8px_hsl(var(--primary))]"
                >
                  <Link href="/downloads" className="flex items-center gap-2">
                    Get Apex Recovery <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-13 px-8 text-base font-semibold rounded-xl border-border/60 bg-card/50 hover:bg-secondary"
                >
                  <a
                    href="https://github.com/Apex-Recovery"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    View Source
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{opacity: 0, x: 40}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.8, ease: 'easeOut', delay: 0.2}}
            >
              <TerminalWindow />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/40 bg-card/40 backdrop-blur-sm py-0">
        <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
          <div className="flex justify-center divide-x divide-border/40">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-6 py-5 text-center">
                <div className="text-lg font-display font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 relative">
        <div className="container mx-auto px-4 sm:px-8 max-w-7xl">
          <motion.div
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6}}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight">
              Engineered for control.
            </h2>
            <p className="text-muted-foreground text-lg">
              Every detail designed to give you total mastery over your
              device&apos;s partitions, data, and system integrity.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{once: true, margin: '-80px'}}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={itemVariants}
                className="p-7 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-[0_0_30px_-12px_hsl(var(--primary)/0.4)] transition-all group cursor-default"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                  {f.icon}
                </div>
                <h3 className="text-lg font-display font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-28 bg-card/30 border-y border-border/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-8 max-w-4xl relative z-10">
          <motion.div
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6}}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
              Why Apex over TWRP?
            </h2>
            <p className="text-lg text-muted-foreground mb-14 max-w-2xl leading-relaxed">
              TWRP paved the way for Android modding. But the ecosystem moved
              on — A/B partitions, dynamic super, and FBEv2 demand a modern
              foundation built today.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{once: true, margin: '-60px'}}
            className="space-y-5"
          >
            {COMPARISON.map((item, i) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="flex gap-5 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="mt-0.5 w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-accent flex items-center justify-center shrink-0 text-sm font-bold font-display">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-lg font-bold font-display text-foreground mb-1">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            viewport={{once: true}}
            transition={{delay: 0.4}}
          >
            <Button
              asChild
              variant="link"
              className="mt-10 px-0 text-accent hover:text-accent/80 font-semibold group"
            >
              <Link href="/downloads" className="flex items-center gap-1">
                Check supported devices
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/12 blur-[120px] pointer-events-none" />
        <motion.div
          initial={{opacity: 0, y: 30}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.7}}
          className="container mx-auto px-4 sm:px-8 text-center relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-5 tracking-tight">
            Ready to flash?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed">
            Join the recovery revolution. Better tools, better control, better
            Android.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 px-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_60px_-10px_hsl(var(--primary))] hover:shadow-[0_0_80px_-8px_hsl(var(--primary))] transition-all"
            >
              <Link href="/downloads" className="flex items-center gap-2">
                Download Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 px-10 text-base font-semibold rounded-xl border-border/60 bg-card/50 hover:bg-secondary"
            >
              <a
                href="https://github.com/Apex-Recovery"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                Star on GitHub
              </a>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
