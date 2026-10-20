const TEXT = 'FREELANCER SWIPE • FIND TALENT FAST • TICK TO CONNECT • '

export function MarqueeFooter() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-20 overflow-hidden border-t border-card-border bg-black/70 py-2 backdrop-blur-sm">
      <p className="animate-marquee whitespace-nowrap text-[11px] font-semibold tracking-[0.25em] text-accent">
        {TEXT.repeat(3)}
      </p>
    </footer>
  )
}
