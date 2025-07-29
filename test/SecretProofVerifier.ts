import { expect } from "chai";
import { ethers } from "hardhat";

describe("SecretProofVerifier", function () {
  let secretProofVerifier: any;
  let owner: any;
  let user: any;

  // Test helper function to calculate commitment
  function calculateCommitment(secret: number): number {
    return secret * secret + secret + 42;
  }

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    
    // Deploy the generated Groth16 verifier contract
    const Groth16Verifier = await ethers.getContractFactory("SecretProofGroth16Verifier");
    const groth16Verifier = await Groth16Verifier.deploy();
    await groth16Verifier.waitForDeployment();
    
    // Deploy the main SecretProofVerifier contract
    const SecretProofVerifier = await ethers.getContractFactory("SecretProofVerifier");
    secretProofVerifier = await SecretProofVerifier.deploy(await groth16Verifier.getAddress());
    await secretProofVerifier.waitForDeployment();
  });

  describe("Commitment Generation", function () {
    it("Should generate correct commitment for a given secret", async function () {
      const secret = 42;
      const expectedCommitment = calculateCommitment(secret);
      
      const contractCommitment = await secretProofVerifier.generateCommitment(secret);
      expect(contractCommitment).to.equal(expectedCommitment);
    });

    it("Should generate different commitments for different secrets", async function () {
      const secret1 = 42;
      const secret2 = 100;
      
      const commitment1 = await secretProofVerifier.generateCommitment(secret1);
      const commitment2 = await secretProofVerifier.generateCommitment(secret2);
      
      expect(commitment1).to.not.equal(commitment2);
    });
  });

  describe("Commitment Verification Status", function () {
    it("Should return false for unverified commitments", async function () {
      const commitment = calculateCommitment(42);
      const isVerified = await secretProofVerifier.isCommitmentVerified(commitment);
      expect(isVerified).to.be.false;
    });
  });

  describe("Proof Verification", function () {
    it("Should allow verification with simplified function for testing", async function () {
      const secret = 42;
      const commitment = calculateCommitment(secret);
      
      // Verify using the simplified function
      await secretProofVerifier.verifySecretKnowledgeSimple(commitment);
      
      // Check that commitment is now verified
      const isVerified = await secretProofVerifier.isCommitmentVerified(commitment);
      expect(isVerified).to.be.true;
    });

    it("Should emit ProofVerified event when using simplified verification", async function () {
      const secret = 100;
      const commitment = calculateCommitment(secret);
      
      await expect(secretProofVerifier.verifySecretKnowledgeSimple(commitment))
        .to.emit(secretProofVerifier, "ProofVerified")
        .withArgs(commitment, owner.address);
    });
  });

  describe("Secret Revelation", function () {
    it("Should revert when trying to reveal secret for unverified commitment", async function () {
      const secret = 42;
      const commitment = calculateCommitment(secret);
      
      await expect(
        secretProofVerifier.revealSecret(commitment, secret)
      ).to.be.revertedWith("Commitment not verified");
    });

    it("Should allow secret revelation after verification", async function () {
      const secret = 999;
      const commitment = calculateCommitment(secret);
      
      // First verify the commitment
      await secretProofVerifier.verifySecretKnowledgeSimple(commitment);
      
      // Then reveal the secret
      await expect(secretProofVerifier.revealSecret(commitment, secret))
        .to.emit(secretProofVerifier, "SecretRevealed")
        .withArgs(commitment, secret);
    });

    it("Should revert when revealing wrong secret for commitment", async function () {
      const secret = 42;
      const wrongSecret = 43;
      const commitment = calculateCommitment(secret);
      
      // Verify the commitment with correct secret
      await secretProofVerifier.verifySecretKnowledgeSimple(commitment);
      
      // Try to reveal with wrong secret
      await expect(
        secretProofVerifier.revealSecret(commitment, wrongSecret)
      ).to.be.revertedWith("Invalid secret");
    });
  });
});
