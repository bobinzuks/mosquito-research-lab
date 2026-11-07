// Evidence links are curated inputs. The engine validates and reports them,
// while independent reviewers decide whether the links justify a conclusion.
export function investigate({ question, hypotheses, evidence }) {
  if (!question?.id || !question.text?.trim()) throw new Error('Question ID and text required');
  if (!Array.isArray(hypotheses) || hypotheses.length < 2) {
    throw new Error('At least two competing hypotheses required');
  }

  const records = new Map();
  for (const record of evidence) {
    if (!record.id || records.has(record.id) || !record.source?.url ||
        !record.limitations?.trim() || !record.reviewStatus) {
      throw new Error('Evidence requires a unique ID, source URL, limitations and review status');
    }
    records.set(record.id, record);
  }

  const hypothesisIds = new Set();
  const assessments = hypotheses.map(({ id, prediction, links }) => {
    if (!id || hypothesisIds.has(id) || !prediction?.trim()) {
      throw new Error('Hypothesis requires a unique ID and testable prediction');
    }
    hypothesisIds.add(id);

    const seen = new Set();
    const observations = links.map(({ evidenceId, relation, rationale }) => {
      const record = records.get(evidenceId);
      if (!record || seen.has(evidenceId) || !['supports', 'challenges', 'context'].includes(relation) ||
          !rationale?.trim()) {
        throw new Error(`Invalid evidence link for ${id}: ${evidenceId}`);
      }
      seen.add(evidenceId);
      return { relation, rationale, record: structuredClone(record) };
    });

    return {
      id,
      prediction,
      status: 'pending-independent-review',
      observations,
      gaps: [
        ...(!observations.some(item => item.relation === 'supports') ? ['no-linked-support'] : []),
        ...(!observations.some(item => item.relation === 'challenges') ? ['no-linked-challenge'] : []),
      ],
    };
  });

  return { question: structuredClone(question), assessments };
}
