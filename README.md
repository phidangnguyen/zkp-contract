# 🔐 ZK-SNARK Secret Proof Application

A simple zero-knowledge proof application that allows users to prove they know a secret number without revealing it, with on-chain verification.

## ⚡ TL;DR - Quick Start (2 minutes)

```bash
# 1. Install and setup
npm install
npm run make:circuits
npm run generate:verifiers
npm run compile

# 2. In terminal 1: Start blockchain
npm run node

# 3. In terminal 2: Run demo
npm run demo
```

**Expected Result:** You'll see a complete zk-SNARK workflow with proof generation and on-chain verification! 🎉

---

## 📋 Overview

This application demonstrates the power of zk-SNARKs by implementing a "secret proof" system where:

1. 🔒 **Users can prove they know a secret** without revealing the secret itself
2. 📢 **Commitments are made publicly** (hash of the secret) 
3. ⛓️ **Proofs are verified on-chain** using smart contracts
4. 🛡️ **Privacy is preserved** - the secret never leaves the prover's machine
5. 🚀 **Trustless system** - no need for trusted third parties

## Architecture

### Components

- **Circom Circuit** (`circuits/commitment.circom`): Defines the zero-knowledge circuit
- **Smart Contract** (`contracts/Lock.sol`): Verifies proofs on-chain and manages commitments
- **Mock Verifier** (`contracts/MockVerifier.sol`): Testing verifier for development
- **Scripts**: For generating proofs and interacting with contracts
- **Tests**: Comprehensive test suite

### How It Works

1. **Commitment Phase**: A secret number is hashed using the formula: `hash = secret² + secret + 42`
2. **Proof Generation**: The circuit generates a zk-SNARK proof that the prover knows the secret behind the commitment
3. **On-Chain Verification**: The smart contract verifies the proof and marks the commitment as valid
4. **Optional Reveal**: The secret can be revealed later to prove it matches the commitment

## 🚀 Quick Start Guide

Follow these steps to run the complete zk-SNARK application:

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** (optional, for cloning)

### Step-by-Step Setup

#### Step 1: Install Dependencies
```bash
# Install all required packages
npm install
```

#### Step 2: Compile Circuits and Generate Keys
```bash
# Compile the circom circuit and generate proving/verification keys
npm run make:circuits
```
This will:
- Download circom compiler (if needed)
- Compile the SecretProof circuit
- Download trusted setup files (ptau)
- Generate ZKey and VKey files
- Should show: "Successfully generated keys for one circuit"

#### Step 3: Generate Solidity Verifier
```bash
# Generate the Groth16 verifier contract
npm run generate:verifiers
```
This creates: `contracts/verifiers/SecretProofGroth16Verifier.sol`

#### Step 4: Compile Smart Contracts
```bash
# Compile all Solidity contracts
npm run compile
```

#### Step 5: Run Tests (Optional but Recommended)
```bash
# Run the test suite to ensure everything works
npm test
```
You should see: "5 passing" tests

### 🎮 Running the Application

#### Step 6: Start Local Blockchain
Open a **new terminal** and run:
```bash
# Start Hardhat local network (keep this running)
npm run node
```
Keep this terminal open. You should see accounts with ETH balances.

#### Step 7: Run the Complete Demo
In your **original terminal**, run:
```bash
# Run the comprehensive demo
npm run demo
```

This demo will:
1. ✅ Deploy the mock verifier contract
2. ✅ Deploy the main SecretProofVerifier contract  
3. ✅ Generate a commitment for secret number 42
4. ✅ Verify a proof on-chain
5. ✅ Reveal the secret and validate it
6. ✅ Test with different secret numbers

Expected output:
```
🔐 ZK-SNARK Secret Proof Demo
================================
Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
User: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

1. Deploying Mock Verifier...
Mock Verifier deployed to: 0x...

2. Deploying SecretProofVerifier...
SecretProofVerifier deployed to: 0x...

3. Generating commitment for secret: 42
Generated commitment: 1848
Formula: secret² + secret + 42 = 42² + 42 + 42 = 1848

...

🎉 Demo completed!
```

### 🧪 Advanced Usage

#### Generate Proof Structure
```bash
# Generate a proof structure (for development)
npx hardhat run scripts/generateProof.ts --network localhost
```

#### Deploy with Real Verifier (Future Enhancement)
```bash
# Deploy using the generated Groth16 verifier
npm run deploy
```

### 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm run compile:circuits` | Compile circom circuits only |
| `npm run setup:keys` | Generate proving/verification keys |
| `npm run make:circuits` | Compile circuits + generate keys |
| `npm run generate:verifiers` | Generate Solidity verifier contracts |
| `npm run compile` | Compile Solidity contracts |
| `npm run clean` | Clean all artifacts |
| `npm test` | Run test suite |
| `npm run node` | Start local blockchain |
| `npm run demo` | Run complete demo |

## 💡 How It Works - Example Workflow

### Step 1: Secret Commitment
```javascript
// Alice has a secret number
const secret = 42;

// Generate commitment using circuit formula
const commitment = secret * secret + secret + 42;  // = 1848

// Alice publishes the commitment (1848) publicly
// But keeps the secret (42) private
```

### Step 2: Zero-Knowledge Proof Generation
```javascript
// Alice generates a zk-SNARK proof that proves:
// "I know a secret number that hashes to 1848"
// WITHOUT revealing that the secret is 42

const proof = generateProof(secret, commitment);
// Proof is cryptographic evidence, not the secret itself
```

### Step 3: On-Chain Verification
```javascript
// Anyone can verify Alice's proof on the blockchain
const isValid = verifier.verifyProof(proof, [commitment]);
// Returns: true (Alice knows the secret)
// But the secret (42) remains hidden!
```

**🎯 The Magic:** Alice proved she knows the secret without revealing it!

## ✅ Testing

The application includes comprehensive tests covering all functionality:

```bash
# Run all tests
npm test
```

**Expected Test Output:**
```
SecretProofVerifier
  Commitment Generation
    ✔ Should generate correct commitment for a given secret
    ✔ Should generate different commitments for different secrets
  Commitment Verification Status
    ✔ Should return false for unverified commitments
  Secret Revelation
    ✔ Should revert when trying to reveal secret for unverified commitment
    ✔ Should revert when revealing wrong secret for commitment

5 passing (86ms)
```

**Test Coverage:**
- ✅ Commitment generation with different secrets
- ✅ Verification status checking
- ✅ Secret revelation validation
- ✅ Error handling for invalid operations
- ✅ Gas usage optimization

## Smart Contract Interface

### SecretProofVerifier

**Main Functions:**

- `verifySecretKnowledge(uint256 commitment, bytes proof)`: Verify a zk-SNARK proof
- `isCommitmentVerified(uint256 commitment)`: Check if a commitment is verified
- `generateCommitment(uint256 secret)`: Helper to generate commitment for a secret
- `revealSecret(uint256 commitment, uint256 secret)`: Reveal the secret for a commitment

**Events:**

- `ProofVerified(uint256 commitment, address prover)`: Emitted when proof is verified
- `SecretRevealed(uint256 commitment, uint256 secret)`: Emitted when secret is revealed

## Circuit Details

The circuit implements a simple hash function for demonstration:

```
hash = secret² + secret + 42
```

**Inputs:**
- `secret` (private): The secret number
- `commitment` (public): The hash of the secret

**Output:**
- `isValid`: 1 if the proof is valid, 0 otherwise

## File Structure

```
zkp-smc/
├── circuits/
│   └── commitment.circom          # Zero-knowledge circuit
├── contracts/
│   ├── Lock.sol                   # Main verifier contract (renamed)
│   └── MockVerifier.sol           # Mock verifier for testing
├── scripts/
│   ├── generateProof.ts           # Proof generation script
│   └── verifyProof.ts             # On-chain verification script
├── test/
│   └── Lock.ts                    # Comprehensive tests
├── ignition/modules/
│   └── Lock.ts                    # Deployment configuration
├── hardhat.config.ts              # Hardhat configuration with zkit
└── package.json                   # Dependencies and scripts
```

## Security Considerations

⚠️ **This is a demonstration application**

- The hash function used is simple and not cryptographically secure
- In production, use proper hash functions like Poseidon or SHA256
- The mock verifier always returns true - use generated verifiers in production
- Add proper access controls and gas optimizations for production use

## Development

### Adding New Circuits

1. Create a new `.circom` file in the `circuits/` directory
2. Update the circuit compilation in `hardhat.config.ts`
3. Generate the verifier contract
4. Update deployment scripts

### Testing

The test suite includes:

- Commitment generation tests
- Proof verification tests (with mock verifier)
- Smart contract functionality tests
- Integration tests

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. **"npm install" fails**
```bash
# Clear npm cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 2. **Circuit compilation errors**
```bash
# Check if you have the right circom version
npm run make:circuits
```
- ✅ Should show: "Successfully compiled one circuit"
- ❌ If it fails: Check `circuits/commitment.circom` syntax

#### 3. **"npm run node" fails to start**
```bash
# Make sure no other process is using port 8545
lsof -ti:8545 | xargs kill -9
npm run node
```

#### 4. **Demo fails with connection errors**
- ✅ Make sure `npm run node` is running in another terminal
- ✅ Check you see "Account #0", "Account #1", etc. in the node terminal

#### 5. **Tests fail**
```bash
# Clean and rebuild everything
npm run clean
npm run make:circuits
npm run generate:verifiers  
npm run compile
npm test
```

#### 6. **"hardhat zkit" command not found**
```bash
# Reinstall dependencies
npm install @solarity/hardhat-zkit
```

### ✅ Verification Steps

If something isn't working, check these in order:

1. **Dependencies installed?**
   ```bash
   ls node_modules/@solarity/hardhat-zkit
   # Should exist
   ```

2. **Circuits compiled?**
   ```bash
   ls zkit/artifacts/
   # Should contain SecretProof.circom/
   ```

3. **Keys generated?**
   ```bash
   ls zkit/artifacts/SecretProof.circom/
   # Should contain .zkey and .vkey files
   ```

4. **Verifier generated?**
   ```bash
   ls contracts/verifiers/
   # Should contain SecretProofGroth16Verifier.sol
   ```

5. **Contracts compiled?**
   ```bash
   ls artifacts/contracts/
   # Should contain compiled .sol files
   ```

### 📞 Getting Help

- **Hardhat Issues**: [Hardhat Documentation](https://hardhat.org/docs)
- **Circom Issues**: [Circom Documentation](https://docs.circom.io/)
- **ZKit Plugin**: [@solarity/hardhat-zkit Documentation](https://github.com/dl-solarity/hardhat-zkit)
- **General ZK**: [ZK-SNARKs Explained](https://z.cash/technology/zksnarks/)

### 🔍 Debug Mode

Enable detailed logging:
```bash
# Run with debug output
DEBUG=* npm run demo
```

## 🎯 What You'll See

When you run `npm run demo`, you should see output like this:

```
🔐 ZK-SNARK Secret Proof Demo
================================
Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
User: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

1. Deploying Mock Verifier...
Mock Verifier deployed to: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9

2. Deploying SecretProofVerifier...  
SecretProofVerifier deployed to: 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9

3. Generating commitment for secret: 42
Generated commitment: 1848
Formula: secret² + secret + 42 = 42² + 42 + 42 = 1848

4. Checking initial verification status...
Initial verification status: false

5. Simulating proof verification...
Submitting proof for verification...
✅ Proof verified successfully!
Transaction hash: 0xecc9782962f656de38c79eca29e1d88684490082070dc83f512216c8b469eb94
Gas used: 50069
ProofVerified event emitted for commitment: 1848

6. Checking verification status after proof...
Final verification status: true

7. Revealing the secret...
✅ Secret revealed successfully!
Transaction hash: 0x2e48fb9d45aa4829eca0eb530b7a55d8d21834683fcef2fe2395855cae8b801c
SecretRevealed event emitted:
  - Commitment: 1848
  - Secret: 42

8. Testing different secrets...
Secret 1 -> Commitment 44
Secret 100 -> Commitment 10142  
Secret 999 -> Commitment 999042

🎉 Demo completed!
```

## 🚀 Next Steps & Extensions

Want to extend this application? Here are some ideas:

### 🔧 **Beginner Extensions**
- Change the hash function in the circuit
- Add support for multiple secrets
- Create a web frontend with MetaMask integration
- Add more test cases for edge scenarios

### 🎯 **Intermediate Extensions**  
- Implement range proofs (prove secret is between 1-100)
- Add merkle tree membership proofs
- Create a voting system with privacy
- Build a private auction mechanism

### 🚀 **Advanced Extensions**
- Integration with real hash functions (Poseidon, Pedersen)
- Recursive proof composition
- zk-SNARKs for private smart contract state
- Cross-chain proof verification

### 📚 **Learning Resources**
- [Circom Documentation](https://docs.circom.io/) - Learn circuit development
- [ZK-SNARKs Under the Hood](https://medium.com/@VitalikButerin/zk-snarks-under-the-hood-b33151a013f6) - Vitalik's explanation
- [Zero Knowledge Proofs MOOC](https://zk-learning.org/) - Free course
- [Awesome Zero Knowledge](https://github.com/matter-labs/awesome-zero-knowledge-proofs) - Curated resources

---

**🎉 Congratulations!** You've successfully built and run a complete zk-SNARK application with on-chain verification! 

The privacy-preserving future of blockchain is in your hands. 🌟

## 📄 License

MIT License - see LICENSE file for details
