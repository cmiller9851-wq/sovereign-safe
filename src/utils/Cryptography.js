import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { ECPair } from 'bitcoinjs-lib';

export const generateMnemonic = () => {
  return generateMnemonic();
};

export const createWallet = (mnemonic) => {
  const seed = mnemonicToSeedSync(mnemonic);
  const keyPair = ECPair.fromSeed(seed);
  return keyPair.toString();
};
