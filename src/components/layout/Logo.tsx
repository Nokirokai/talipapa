export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300 text-2xl shadow-clay">
        <svg viewBox="0 0 64 64" className="h-9 w-9" role="img" aria-label="Talipapa logo">
          <path d="M10 29h44v25H10z" fill="#0D9488" />
          <path d="M6 29 16 12h32l10 17z" fill="#F59E0B" />
          <path d="M17 35c8-8 18-8 30 0-12 8-22 8-30 0Z" fill="#FFF8F0" />
          <circle cx="42" cy="35" r="2" fill="#0F172A" />
          <path d="M17 35 9 30v10z" fill="#FFF8F0" />
        </svg>
      </div>
      {!compact ? (
        <div>
          <div className="font-display text-lg font-extrabold text-talipapa-white">Talipapa POS</div>
          <div className="text-xs font-semibold text-amber-100/70">Ang inyong tindahan, digitally</div>
        </div>
      ) : null}
    </div>
  )
}
