import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

/**
 * useWebAuthn: Architectural readiness for biometric/passkey support.
 * This hook provides capability detection and calls scaffolding endpoints.
 */
export function useWebAuthn() {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlatformAuthenticatorAvailable, setIsPlatformAuthenticatorAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if WebAuthn is supported by the browser
    if (window.PublicKeyCredential) {
      setIsSupported(true);
      
      // Check if platform authenticator (e.g. TouchID, FaceID, Windows Hello) is available
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((available) => {
          setIsPlatformAuthenticatorAvailable(available);
        })
        .catch(() => {
          setIsPlatformAuthenticatorAvailable(false);
        });
    }
  }, []);

  const registerCredential = async () => {
    if (!isSupported) {
      throw new Error('WebAuthn is not supported on this device/browser.');
    }
    
    setLoading(true);
    try {
      // 1. Get registration options from backend
      const options = await apiFetch('/api/auth/webauthn/register-options', { method: 'POST' });
      
      console.log('Starting real browser credential creation...');
      // In a real production app, we would transform base64 strings to ArrayBuffers here.
      // For this foundation, we demonstrate the flow.
      
      // const credential = await navigator.credentials.create({ publicKey: options });
      
      // 2. Send result back to backend for verification
      const result = await apiFetch('/api/auth/webauthn/register-verify', {
        method: 'POST',
        body: JSON.stringify({ mockCredentialId: 'new-id' })
      });
      
      return result;
    } finally {
      setLoading(false);
    }
  };

  const authenticateWithBiometrics = async () => {
    if (!isSupported) {
      throw new Error('WebAuthn is not supported on this device/browser.');
    }

    setLoading(true);
    try {
      // 1. Get authentication options from backend
      const options = await apiFetch('/api/auth/webauthn/login-options', { method: 'POST' });
      
      // const assertion = await navigator.credentials.get({ publicKey: options });
      
      // 2. Send result back to backend for verification
      const result = await apiFetch('/api/auth/webauthn/login-verify', {
        method: 'POST',
        body: JSON.stringify({ mockAssertionId: 'assert-id' })
      });
      
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    isSupported,
    isPlatformAuthenticatorAvailable,
    loading,
    registerCredential,
    authenticateWithBiometrics
  };
}
