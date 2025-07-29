pragma circom 2.0.0;

// Simple circuit to prove knowledge of a secret without revealing it
// Uses a basic hash function for demonstration
template SecretProof() {
    // Private input: the secret number (private by default for inputs)
    signal input secret;
    
    // Public input: the hash of the secret (commitment)
    signal input commitment;
    
    // Output: verification that we know the secret
    signal output isValid;
    
    // Simple hash function: hash = secret^2 + secret + 42
    // In a real application, you'd use a proper hash function
    signal secretSquared;
    signal hash;
    
    secretSquared <== secret * secret;
    hash <== secretSquared + secret + 42;
    
    // Check that the hash matches the commitment
    component eq = IsEqual();
    eq.in[0] <== hash;
    eq.in[1] <== commitment;
    
    isValid <== eq.out;
    
    // Ensure isValid is either 0 or 1
    isValid * (1 - isValid) === 0;
}

template IsEqual() {
    signal input in[2];
    signal output out;
    
    component eq = IsZero();
    eq.in <== in[0] - in[1];
    out <== eq.out;
}

template IsZero() {
    signal input in;
    signal output out;
    
    signal inv;
    
    inv <-- in != 0 ? 1/in : 0;
    
    out <== -in*inv + 1;
    in*out === 0;
}

component main = SecretProof();
