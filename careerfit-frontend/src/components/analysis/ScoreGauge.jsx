import React from 'react';
import { getScoreTier } from '../../utils/formatters.js';

/**
 * Typographic match score with an accessible scale and tier description.
 */
export function ScoreGauge({ score = 0, size = 180 }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score || 0)));
  const tier = getScoreTier(safeScore);

  return (
    <div className="mx-auto flex w-full flex-col items-center text-center" style={{ maxWidth: size }}>
      <div
        role="meter"
        aria-label="Resume-to-role compatibility score"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeScore}
        aria-valuetext={`${safeScore}% — ${tier.label}`}
        className="w-full"
      >
        <p className="cf-label text-left">Match score</p>
        <div className="mt-3 flex items-baseline justify-center gap-1 text-slate-900">
          <span className="cf-result-score font-mono tabular-nums">{safeScore}</span>
          <span className="cf-result-unit">%</span>
        </div>
        <div className="cf-score-track mt-5 h-1.5 overflow-hidden rounded-full" aria-hidden="true">
          <div
            className="cf-score-fill h-full w-full origin-left rounded-full transition-transform duration-700 ease-out"
            style={{ transform: `scaleX(${safeScore / 100})` }}
          />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] tabular-nums text-slate-400" aria-hidden="true">
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      <div className="mt-5 space-y-1">
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${tier.badgeClass}`}>
          {tier.label}
        </div>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          {tier.description}
        </p>
      </div>
    </div>
  );
}
