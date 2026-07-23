from abc import ABC, abstractmethod
import hashlib
import hmac
import json
import logging
import struct
from typing import Any, Dict, List, Tuple

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("MULTI_CHAIN_WALLET_v1.0")


class DeterministicKeyCore:
    """
    Handles BIP-39/BIP-32 key derivation operations.
    Keeps raw entropy localized and isolated from network transport interfaces.
    """

    def __init__(self, seed_hex: str):
        self._seed = bytes.fromhex(seed_hex)

    def derive_master_key(self) -> Tuple[bytes, bytes]:
        """Derives HMAC-SHA512 master key and chain code from seed."""
        h = hmac.new(b"Bitcoin seed", self._seed, hashlib.sha512).digest()
        return h[:32], h[32:]

    def derive_path_child(self, parent_key: bytes, parent_chain: bytes, index: int) -> Tuple[bytes, bytes]:
        """Derives child key given parent key, chain code, and index (Hardened if index >= 0x80000000)."""
        data = bytearray()
        if index >= 0x80000000:
            data.append(0x00)
            data.extend(parent_key)
        else:
            # Simplified mockup: Public key derivation path placeholder
            data.extend(parent_key)
        data.extend(struct.pack(">I", index))

        h = hmac.new(parent_chain, data, hashlib.sha512).digest()
        return h[:32], h[32:]

    def derive_keypair_for_path(self, path: List[int]) -> bytes:
        """Iteratively derives private key bytes along an integer path array."""
        key, chain = self.derive_master_key()
        for idx in path:
            key, chain = self.derive_path_child(key, chain, idx)
        return key


class BaseChainAdapter(ABC):
    """Abstract Base Class for all modular chain adapters."""

    @abstractmethod
    def derive_address(self, private_key: bytes) -> str:
        """Computes canonical public address string from derived private key."""
        pass

    @abstractmethod
    def serialize_unsigned_payload(self, tx_params: Dict[str, Any]) -> bytes:
        """Converts human-readable parameters into canonical raw byte payload."""
        pass

    @abstractmethod
    def sign_transaction(self, private_key: bytes, payload_bytes: bytes) -> Dict[str, Any]:
        """Signs the transaction byte payload deterministically."""
        pass


class EVMChainAdapter(BaseChainAdapter):
    """Adapter targeting Ethereum/EVM-compatible execution environments."""

    def derive_address(self, private_key: bytes) -> str:
        # Pseudo-Address derivation for specification proof (Keccak256 snippet replacement)
        pub_hash = hashlib.sha256(private_key).hexdigest()
        return f"0x{pub_hash[-40:]}"

    def serialize_unsigned_payload(self, tx_params: Dict[str, Any]) -> bytes:
        canonical_str = json.dumps(tx_params, sort_keys=True)
        return canonical_str.encode("utf-8")

    def sign_transaction(self, private_key: bytes, payload_bytes: bytes) -> Dict[str, Any]:
        tx_hash = hashlib.sha256(payload_bytes).digest()
        # HMAC-SHA256 deterministic signature mock
        sig = hmac.new(private_key, tx_hash, hashlib.sha256).hexdigest()
        return {
            "chain": "EVM",
            "raw_payload_hex": payload_bytes.hex(),
            "signature": sig,
            "hash": tx_hash.hex()
        }


class UTXOChainAdapter(BaseChainAdapter):
    """Adapter targeting Bitcoin/UTXO-style execution environments."""

    def derive_address(self, private_key: bytes) -> str:
        pub_hash = hashlib.sha256(private_key).hexdigest()
        return f"bc1q{pub_hash[:38]}"

    def serialize_unsigned_payload(self, tx_params: Dict[str, Any]) -> bytes:
        buffer = bytearray()
        buffer.extend(struct.pack(">I", tx_params.get("version", 1)))
        buffer.extend(json.dumps(tx_params.get("inputs", [])).encode("utf-8"))
        buffer.extend(json.dumps(tx_params.get("outputs", [])).encode("utf-8"))
        return bytes(buffer)

    def sign_transaction(self, private_key: bytes, payload_bytes: bytes) -> Dict[str, Any]:
        tx_hash = hashlib.sha256(hashlib.sha256(payload_bytes).digest()).digest()
        sig = hmac.new(private_key, tx_hash, hashlib.sha256).hexdigest()
        return {
            "chain": "UTXO",
            "raw_payload_hex": payload_bytes.hex(),
            "signature": sig,
            "txid": tx_hash.hex()
        }


class UnifiedWalletGateway:
    """
    Unified Gateway coordinating key derivation, adapter dispatch, and transaction signing.
    """

    def __init__(self, seed_hex: str):
        self.core = DeterministicKeyCore(seed_hex)
        self.adapters: Dict[str, BaseChainAdapter] = {
            "evm": EVMChainAdapter(),
            "utxo": UTXOChainAdapter()
        }
        # Pre-defined path configurations
        self.path_registry: Dict[str, List[int]] = {
            "evm": [0x8000002C, 0x8000003C, 0x80000000, 0, 0],   # m/44'/60'/0'/0/0
            "utxo": [0x80000054, 0x80000000, 0x80000000, 0, 0]  # m/84'/0'/0'/0/0
        }

    def register_adapter(self, chain_id: str, adapter: BaseChainAdapter, derivation_path: List[int]):
        """Registers custom adapters (e.g., SVM, Arweave/AO process callers)."""
        self.adapters[chain_id.lower()] = adapter
        self.path_registry[chain_id.lower()] = derivation_path

    def get_address(self, chain_id: str) -> str:
        chain_key = chain_id.lower()
        if chain_key not in self.adapters:
            raise ValueError(f"Unsupported chain: {chain_id}")
        
        path = self.path_registry[chain_key]
        private_key = self.core.derive_keypair_for_path(path)
        return self.adapters[chain_key].derive_address(private_key)

    def execute_sign(self, chain_id: str, tx_params: Dict[str, Any]) -> Dict[str, Any]:
        chain_key = chain_id.lower()
        if chain_key not in self.adapters:
            raise ValueError(f"Unsupported chain: {chain_id}")

        adapter = self.adapters[chain_key]
        path = self.path_registry[chain_key]
        
        private_key = self.core.derive_keypair_for_path(path)
        payload_bytes = adapter.serialize_unsigned_payload(tx_params)
        signed_result = adapter.sign_transaction(private_key, payload_bytes)
        
        logger.info(f"Successfully signed payload for chain [{chain_id.upper()}]")
        return signed_result


if __name__ == "__main__":
    # 256-bit test seed entropy
    TEST_SEED = "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"
    gateway = UnifiedWalletGateway(seed_hex=TEST_SEED)

    print("\n--- Derived Addresses ---")
    evm_addr = gateway.get_address("evm")
    utxo_addr = gateway.get_address("utxo")
    print(f"EVM Address:  {evm_addr}")
    print(f"UTXO Address: {utxo_addr}")

    print("\n--- Signing Execution ---")
    evm_tx = {"to": evm_addr, "value": 1000000000000000000, "nonce": 0}
    signed_evm = gateway.execute_sign("evm", evm_tx)
    print("EVM Signed Output:\n", json.dumps(signed_evm, indent=2))

    utxo_tx = {"version": 2, "inputs": [{"txid": "abc...", "vout": 0}], "outputs": [{"address": utxo_addr, "amount": 50000}]}
    signed_utxo = gateway.execute_sign("utxo", utxo_tx)
    print("UTXO Signed Output:\n", json.dumps(signed_utxo, indent=2))
