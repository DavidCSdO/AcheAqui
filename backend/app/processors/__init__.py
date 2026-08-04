from app.processors.pipeline import ProspectingPipeline
from app.processors.deduplicator import is_duplicate, normalize_name
from app.processors.classifier import calculate_lead_score

__all__ = ["ProspectingPipeline", "is_duplicate", "normalize_name", "calculate_lead_score"]
