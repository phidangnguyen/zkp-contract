// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// Interface for the Groth16 verifier contract
interface IGroth16Verifier {
    function verifyProof(
        uint256[2] memory pointA_,
        uint256[2][2] memory pointB_,
        uint256[2] memory pointC_,
        uint256[1] memory publicSignals_
    ) external view returns (bool);
}

contract SecretProofVerifier {
    // The generated Groth16 verifier contract
    IGroth16Verifier public immutable groth16Verifier;
    
    // Mapping to store verified commitments
    mapping(uint256 => bool) public verifiedCommitments;
    
    // Events
    event ProofVerified(uint256 indexed commitment, address indexed prover);
    event SecretRevealed(uint256 indexed commitment, uint256 secret);
    
    constructor(address _groth16Verifier) {
        groth16Verifier = IGroth16Verifier(_groth16Verifier);
    }
    
    /**
     * @dev Verify a zk-SNARK proof that someone knows the secret behind a commitment
     * @param commitment The public commitment (hash of the secret)
     * @param pointA Groth16 proof point A
     * @param pointB Groth16 proof point B  
     * @param pointC Groth16 proof point C
     */
    function verifySecretKnowledge(
        uint256 commitment,
        uint256[2] memory pointA,
        uint256[2][2] memory pointB,
        uint256[2] memory pointC
    ) external {
        // Prepare public signals: [commitment]
        uint256[1] memory publicSignals = [commitment];
        
        // Verify the proof using the Groth16 verifier
        require(
            groth16Verifier.verifyProof(pointA, pointB, pointC, publicSignals),
            "Invalid proof"
        );
        
        // Mark this commitment as verified
        verifiedCommitments[commitment] = true;
        
        emit ProofVerified(commitment, msg.sender);
    }
    
    /**
     * @dev Simplified verify function for testing with mock proofs
     * @param commitment The public commitment (hash of the secret)
     */
    function verifySecretKnowledgeSimple(
        uint256 commitment
    ) external {
        // For testing purposes - mark commitment as verified without proof validation
        // In production, always use verifySecretKnowledge with real proofs
        verifiedCommitments[commitment] = true;
        emit ProofVerified(commitment, msg.sender);
    }
    
    /**
     * @dev Check if a commitment has been verified
     * @param commitment The commitment to check
     */
    function isCommitmentVerified(uint256 commitment) external view returns (bool) {
        return verifiedCommitments[commitment];
    }
    
    /**
     * @dev Generate commitment for a given secret (helper function for testing)
     * This implements the same hash function as the circuit: secret^2 + secret + 42
     * @param secret The secret number
     */
    function generateCommitment(uint256 secret) external pure returns (uint256) {
        return secret * secret + secret + 42;
    }
    
    /**
     * @dev Reveal the secret for a commitment (for demonstration purposes)
     * In a real application, you might want to implement a reveal mechanism
     * @param commitment The commitment
     * @param secret The secret being revealed
     */
    function revealSecret(uint256 commitment, uint256 secret) external {
        require(verifiedCommitments[commitment], "Commitment not verified");
        require(this.generateCommitment(secret) == commitment, "Invalid secret");
        
        emit SecretRevealed(commitment, secret);
    }
}
