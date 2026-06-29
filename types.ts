/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HiddenSetting {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'developer' | 'testing' | 'network';
  adbCommand: string;
  intentUrl: string;
  instructions: string;
}

export interface AndroidPackage {
  id: string;
  name: string;
  packageName: string;
  description: string;
  category: 'bloatware' | 'system' | 'google' | 'social';
  safeToRemove: boolean;
  brand: 'generic' | 'samsung' | 'xiaomi' | 'huawei' | 'motorola' | 'oppo';
}

export interface SecretCode {
  id: string;
  code: string;
  description: string;
  brand: 'universal' | 'samsung' | 'xiaomi' | 'mediatek' | 'qualcomm' | 'motorola';
  functionName: string;
  category: 'hardware' | 'network' | 'system' | 'battery';
}

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system' | 'ai';
  text: string;
  timestamp: string;
}

export interface LicenseKey {
  key: string;
  tier: 'trial' | 'monthly' | '3month' | 'admin';
  durationDays: number;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  buyerEmail: string;
}

export interface PaymentConfig {
  payoutMethod: 'stripe_link' | 'paypal' | 'crypto' | 'whatsapp';
  payoutDetails: string;
  customMessage: string;
}
