# RuVector / Ruflo integration contract

Runtime probes are available in [the compatibility notes](UPSTREAM.md). The research engine has no provider adapter yet.

A future adapter must support:
- `recordEvidence({claimId,sourceId,reviewStatus,provenance})`
- `recordExperiment({strategyId,datasetVersion,metrics,failures})`
- `findRelatedHypotheses({questionId,limit})`
- `proposeStrategy({trainingFeedback,budget})`

Before implementation: verify official upstream repository, pinned package version, API surface, license and hosted-runner compatibility. Default to read-only research and require reviewed promotion of strategies. Do not place API keys in repository.
