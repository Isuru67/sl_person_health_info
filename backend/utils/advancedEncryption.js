import crypto from 'crypto';

// Algorithm configurations
const ALGORITHM = 'aes-256-gcm';  // Using GCM mode for authenticated encryption
const IV_LENGTH = 16;             // For AES, this is always 16
const KEY_LENGTH = 32;            // 256 bits
const AUTH_TAG_LENGTH = 16;       // Authentication tag length for GCM
const SALT_LENGTH = 16;

/**
 * Generate a random AES key for encrypting a treatment record
 * @returns {Buffer} The randomly generated key
 */
export const generateRecordKey = () => {
  return crypto.randomBytes(KEY_LENGTH);
};

/**
 * Derive a key from a password for encrypting/decrypting the record key
 * @param {string} password - The password (patient's or hospital's)
 * @param {string} salt - Salt for key derivation
 * @returns {Buffer} - The derived key
 */
export const deriveKeyFromPassword = (password, salt) => {
  if (!password || !salt) {
    throw new Error('Password and salt are required for key derivation');
  }
  
  return crypto.pbkdf2Sync(
    password, 
    typeof salt === 'string' ? salt : Buffer.from(salt, 'hex'), 
    100000, // Higher iterations for stronger security
    KEY_LENGTH, 
    'sha512'
  );
};

/**
 * Encrypt data using an AES key
 * @param {Object|string} data - Data to encrypt
 * @param {Buffer} key - AES key for encryption
 * @returns {Object} - Object with encrypted data, iv, and auth tag
 */
export const encryptWithKey = (data, key) => {
  if (!data || !key) {
    throw new Error('Data and key are required for encryption');
  }

  try {
    // Generate a random IV for this encryption
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher using GCM mode
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Convert data to JSON string if it's an object
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Encrypt the data
    let encrypted = cipher.update(dataString, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get authentication tag
    const authTag = cipher.getAuthTag().toString('hex');
    
    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      authTag
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

/**
 * Decrypt data using an AES key
 * @param {Object} encryptedPackage - Object with encrypted data, iv, and auth tag
 * @param {Buffer} key - AES key for decryption
 * @returns {Object|string|null} - Decrypted data or null if decryption fails
 */
export const decryptWithKey = (encryptedPackage, key) => {
  if (!encryptedPackage || !key) {
    console.error('Missing encrypted package or key for decryption');
    return null;
  }

  try {
    const { encryptedData, iv, authTag } = encryptedPackage;
    
    // Create decipher
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(iv, 'hex')
    );
    
    // Set auth tag for verification
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    // Decrypt data
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    // Parse JSON if the result is a JSON string
    try {
      return JSON.parse(decrypted);
    } catch (e) {
      // If it's not valid JSON, return as is
      return decrypted;
    }
  } catch (error) {
    console.error('Decryption error:', error);
    return null; // Return null on decryption failure
  }
};

/**
 * Encrypt the record key with a user's derived key
 * @param {Buffer} recordKey - The AES key used to encrypt the record
 * @param {Buffer} derivedKey - The key derived from password
 * @returns {Object} - Encrypted record key package
 */
export const encryptRecordKey = (recordKey, derivedKey) => {
  if (!recordKey || !derivedKey) {
    throw new Error('Record key and derived key are required');
  }
  
  return encryptWithKey(recordKey.toString('hex'), derivedKey);
};

/**
 * Decrypt the record key using a user's derived key
 * @param {Object} encryptedKeyPackage - The encrypted record key package
 * @param {Buffer} derivedKey - The key derived from password
 * @returns {Buffer|null} - The decrypted record key or null
 */
export const decryptRecordKey = (encryptedKeyPackage, derivedKey) => {
  if (!encryptedKeyPackage || !derivedKey) {
    return null;
  }
  
  try {
    const decryptedKeyHex = decryptWithKey(encryptedKeyPackage, derivedKey);
    if (!decryptedKeyHex) return null;
    
    return Buffer.from(decryptedKeyHex, 'hex');
  } catch (error) {
    console.error('Error decrypting record key:', error);
    return null;
  }
};

// Function to encrypt a string (used for key encryption)
const encryptString = (text, password) => {
  // Create a key from password
  const key = crypto.scryptSync(password, 'salt', 32);
  // Create initialization vector
  const iv = crypto.randomBytes(16);
  // Create cipher
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  // Encrypt the data
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // Return the encrypted data and iv
  return {
    encrypted,
    iv: iv.toString('hex')
  };
};

// Function to decrypt a string (used for key decryption)
const decryptString = (encryptedText, iv, password) => {
  try {
    // Create a key from password
    const key = crypto.scryptSync(password, 'salt', 32);
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
    // Decrypt the data
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Encryption function for creating an encrypted record with dual access
export const createEncryptedRecord = (data, hospitalPassword, patientPassword) => {
  // Generate a random symmetric key for encrypting the actual data
  const symmetricKey = crypto.randomBytes(32).toString('hex');
  
  // Convert data to string for encryption
  const dataString = JSON.stringify(data);
  
  // Encrypt the data using the symmetric key
  const encryptedData = encryptString(dataString, symmetricKey);
  
  // Encrypt the symmetric key with hospital password
  const hospitalKeyEncryption = encryptString(symmetricKey, hospitalPassword);
  
  // Encrypt the symmetric key with patient password
  const patientKeyEncryption = encryptString(symmetricKey, patientPassword);
  
  // Return the encrypted package
  return {
    encryptedData: {
      encryptedData: encryptedData.encrypted,
      iv: encryptedData.iv
    },
    hospitalAccess: {
      encryptedKey: hospitalKeyEncryption.encrypted,
      iv: hospitalKeyEncryption.iv
    },
    patientAccess: {
      encryptedKey: patientKeyEncryption.encrypted,
      iv: patientKeyEncryption.iv
    }
  };
};

// Decryption function to handle the encrypted data
export const decryptRecord = (treatmentRecord, credentials) => {
  try {
    const { role, password } = credentials;
    
    console.log(`Attempting to decrypt record with role: ${role}`);
    
    // Choose the correct access key based on role
    const accessKey = role === 'hospital' 
      ? { 
          encryptedKey: treatmentRecord.hospitalAccess.encryptedKey,
          iv: treatmentRecord.hospitalAccess.iv 
        }
      : { 
          encryptedKey: treatmentRecord.patientAccess.encryptedKey, 
          iv: treatmentRecord.patientAccess.iv 
        };
    
    if (!accessKey.encryptedKey || !accessKey.iv) {
      console.log(`No access key found for role: ${role}`);
      return null;
    }
    
    // Decrypt the symmetric key using the password
    const symmetricKey = decryptString(accessKey.encryptedKey, accessKey.iv, password);
    
    if (!symmetricKey) {
      console.log('Failed to decrypt symmetric key - invalid password');
      return null;
    }
    
    // Use the symmetric key to decrypt the actual data
    const decryptedDataString = decryptString(
      treatmentRecord.encryptedData.encryptedData,
      treatmentRecord.encryptedData.iv,
      symmetricKey
    );
    
    if (!decryptedDataString) {
      console.log('Failed to decrypt data - corrupted data or invalid key');
      return null;
    }
    
    // Parse the decrypted data string back to an object
    try {
      const decryptedData = JSON.parse(decryptedDataString);
      console.log('Successfully decrypted treatment data');
      return decryptedData;
    } catch (parseError) {
      console.error('Error parsing decrypted data:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Unexpected error in decryptRecord:', error);
    return null;
  }
};

// Helper function to ensure arrays
function ensureArrayFormat(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    // If it's a comma-separated string, split it
    if (value.includes(',')) {
      return value.split(',').map(item => item.trim());
    }
    // Otherwise just wrap the string in an array
    return [value];
  }
  // For any other type, wrap in array
  return [value];
}
