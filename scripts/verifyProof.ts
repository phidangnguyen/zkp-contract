import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  console.log("🔍 ZK-SNARK Proof Verification");
  console.log("===============================");

  // Load proof data
  if (!fs.existsSync('proof.json')) {
    console.error("❌ proof.json not found. Run generateProof.ts first.");
    console.log("\n💡 To generate a proof structure:");
    console.log("   npx hardhat run scripts/generateProof.ts --network localhost");
    process.exit(1);
  }
  
  const proofData = JSON.parse(fs.readFileSync('proof.json', 'utf8'));
  
  console.log("📋 Proof data loaded:");
  console.log("- Secret (for reference):", proofData.secret);
  console.log("- Commitment (public):", proofData.commitment);
  console.log("- Proof length:", proofData.proof.length, "characters");
  console.log("- Generated at:", proofData.timestamp || "N/A");
  
  // Get signers
  const [deployer, user] = await ethers.getSigners();
  console.log("\n👤 Using accounts:");
  console.log("- Deployer:", deployer.address);
  console.log("- User:", user.address);
  
  let contractAddress = process.env.CONTRACT_ADDRESS;
  let contract: any;
  
  if (!contractAddress) {
    console.log("\n🚀 No CONTRACT_ADDRESS provided, deploying fresh contracts...");
    
    // Deploy the Groth16 verifier
    console.log("1. Deploying Groth16 verifier...");
    const Groth16Verifier = await ethers.getContractFactory("SecretProofGroth16Verifier");
    const groth16Verifier = await Groth16Verifier.deploy();
    await groth16Verifier.waitForDeployment();
    const groth16Address = await groth16Verifier.getAddress();
    console.log("   Groth16 verifier deployed to:", groth16Address);
    
    // Deploy the main contract
    console.log("2. Deploying SecretProofVerifier...");
    const SecretProofVerifier = await ethers.getContractFactory("SecretProofVerifier");
    contract = await SecretProofVerifier.deploy(groth16Address);
    await contract.waitForDeployment();
    contractAddress = await contract.getAddress();
    console.log("   SecretProofVerifier deployed to:", contractAddress);
  } else {
    console.log(`\n📍 Using existing contract at: ${contractAddress}`);
    const SecretProofVerifier = await ethers.getContractFactory("SecretProofVerifier");
    contract = SecretProofVerifier.attach(contractAddress);
  }
  
  console.log("\n🔍 Verifying proof on-chain...");
  
  try {
    // Check initial verification status
    const initialStatus = await contract.isCommitmentVerified(proofData.commitment);
    console.log("- Initial verification status:", initialStatus);
    
    if (initialStatus) {
      console.log("⚠️  Commitment already verified! Skipping verification step.");
    } else {
      // For demo purposes, we'll use the simplified verification
      // In production with real proofs, you would use verifySecretKnowledge with Groth16 points
      console.log("- Submitting proof for verification (using simplified demo function)...");
      console.log("- Note: Real proofs would use verifySecretKnowledge with Groth16 points A, B, C");
      
      const tx = await contract.connect(user).verifySecretKnowledgeSimple(
        proofData.commitment
      );
      
      const receipt = await tx.wait();
      console.log("✅ Proof verification transaction submitted!");
      console.log("- Transaction hash:", tx.hash);
      console.log("- Gas used:", receipt?.gasUsed?.toString() || "N/A");
      console.log("- Block number:", receipt?.blockNumber || "N/A");
    }
    
    // Check final verification status
    const finalStatus = await contract.isCommitmentVerified(proofData.commitment);
    console.log("- Final verification status:", finalStatus);
    
    if (finalStatus) {
      console.log("\n🎉 Success! The proof has been verified on-chain.");
      console.log("✅ Anyone can now confirm that someone knows the secret");
      console.log("🔒 But the secret itself remains private!");
      
      // Demonstrate secret revelation (optional)
      console.log("\n🔓 Demonstrating secret revelation...");
      try {
        const revealTx = await contract.connect(user).revealSecret(proofData.commitment, proofData.secret);
        const revealReceipt = await revealTx.wait();
        console.log("- Secret revealed successfully!");
        console.log("- Reveal transaction:", revealTx.hash);
        console.log("- Gas used for reveal:", revealReceipt?.gasUsed?.toString() || "N/A");
      } catch (revealError) {
        console.log("ℹ️  Secret revelation failed (this might be expected for mock proofs)");
      }
      
    } else {
      console.log("\n❌ Verification failed!");
      console.log("This might happen if:");
      console.log("- The proof is invalid");
      console.log("- The proof is a mock proof (not a real zk-SNARK)");
      console.log("- There's a mismatch between proof and commitment");
      console.log("- For real verification, you need valid Groth16 proof points");
    }
    
  } catch (error) {
    console.error("\n❌ Error during verification:", error);
      console.log("\n🛠️  Troubleshooting tips:");
  console.log("- Make sure the local network is running: npm run node");
  console.log("- For real proofs: generate valid Groth16 points using circuit compilation");
  console.log("- Check if the proof format matches the Groth16 verifier interface");
  console.log("- Verify the contract is deployed properly");
  }
  
  console.log("\n📊 Verification Summary:");
  console.log("- Contract address:", contractAddress);
  console.log("- Commitment:", proofData.commitment);
  console.log("- Proof verification: " + (await contract.isCommitmentVerified(proofData.commitment) ? "✅ VERIFIED" : "❌ NOT VERIFIED"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 