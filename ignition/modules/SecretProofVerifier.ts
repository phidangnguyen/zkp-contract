// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SecretProofVerifierModule = buildModule("SecretProofVerifierModule", (m) => {
  // Deploy the generated Groth16 verifier contract first
  const groth16Verifier = m.contract("SecretProofGroth16Verifier", []);
  
  // Deploy the main SecretProofVerifier contract with the Groth16 verifier address
  const secretProofVerifier = m.contract("SecretProofVerifier", [groth16Verifier]);

  return { secretProofVerifier, groth16Verifier };
});

export default SecretProofVerifierModule;
