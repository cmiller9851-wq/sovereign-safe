import datetime
import hashlib
import json
import sys


class NestedEventHorizon:
    """Models recursive mathematical state collapse across nested event horizons."""

    def __init__(self, depth: int = 2):
        if depth < 1:
            raise ValueError("Singularity depth must be at least 1 layer.")
        self.depth = depth

    def collapse_horizon(self, data: bytes, current_layer: int = 1) -> dict:
        """
        Recursively collapses entropy into nested event horizons.
        Layer N represents the innermost singularity.
        """
        # Cryptographic collapse at current horizon level
        layer_digest = hashlib.sha384(data).hexdigest()

        horizon_node = {
            "horizon_layer": current_layer,
            "horizon_digest": layer_digest,
            "entropy_size_bytes": len(data),
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        }

        # If we have not reached the innermost singularity, fold inward
        if current_layer < self.depth:
            # Serialize outer layer into raw payload for inner collapse
            inner_payload = json.dumps(horizon_node, sort_keys=True).encode("utf-8")
            horizon_node["inner_singularity"] = self.collapse_horizon(
                inner_payload, current_layer + 1
            )

        return horizon_node


def generate_singularity_root(payload: bytes, depth: int = 2) -> dict:
    """Constructs the nested horizon and computes the absolute root proof."""
    engine = NestedEventHorizon(depth=depth)
    horizon_tree = engine.collapse_horizon(payload)

    # Compute absolute root proof hash over the entire nested structure
    root_json = json.dumps(horizon_tree, sort_keys=True).encode("utf-8")
    absolute_root_hash = hashlib.sha256(root_json).hexdigest()

    return {
        "absolute_root_proof": absolute_root_hash,
        "nested_structure": horizon_tree,
    }


if __name__ == "__main__":
    sample_entropy = b"SovereignGate Audit Payload: Absolute Immutable Anchor"
    
    # 2-Layer Singularity: Outer Black Hole containing Inner Black Hole
    result = generate_singularity_root(sample_entropy, depth=2)
    print(json.dumps(result, indent=2))
