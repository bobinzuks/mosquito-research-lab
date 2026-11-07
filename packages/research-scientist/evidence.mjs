export function evaluateClaim(claim) {
  if (!claim || typeof claim.text !== 'string' || !claim.text.trim()) throw new Error('Claim text required');
  const sources = Array.isArray(claim.sources) ? claim.sources : [];
  const verified = sources.filter(s => s && s.id && s.kind === 'observation' && s.reviewed === true);
  return { claim: claim.text, status: verified.length ? 'supported-by-reviewed-observation' : 'unverified', evidenceCount: verified.length, sources: sources.map(s=>s.id).filter(Boolean) };
}
export function compareStrategies(baseline, candidate) {
  for (const n of [baseline, candidate]) if (!n || !Number.isFinite(n.correct) || !Number.isFinite(n.total) || n.total <= 0 || n.correct < 0 || n.correct > n.total) throw new Error('Invalid evaluation');
  return { baselineAccuracy: baseline.correct / baseline.total, candidateAccuracy: candidate.correct / candidate.total, improved: candidate.correct / candidate.total > baseline.correct / baseline.total };
}
