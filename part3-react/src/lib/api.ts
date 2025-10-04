// Taproot Assets API Client
const GATEWAY_URL = 'http://localhost:8080';

export interface Asset {
  asset_id?: string;
  asset_type?: string;
  amount?: string;
  asset_genesis?: {
    name?: string;
    meta_hash?: string;
    asset_id?: string;
    asset_type?: string;
    genesis_point?: string;
  };
  chain_anchor?: {
    block_height?: number;
    anchor_tx?: string;
  };
  decimal_display?: {
    decimal_display?: number;
  };
  script_key?: string;
  prev_witnesses?: any[];
}

export interface AssetBalance {
  asset_id: string;
  balance: string;
  asset_genesis?: {
    name?: string;
  };
}

export interface Address {
  encoded?: string;
  asset_id?: string;
  amount?: string;
}

class TaprootAPI {
  private baseUrl: string;

  constructor(baseUrl: string = GATEWAY_URL) {
    this.baseUrl = baseUrl;
  }

  async getHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async listAssets(): Promise<Asset[]> {
    const response = await fetch(`${this.baseUrl}/v1/taproot-assets/assets`);
    if (!response.ok) throw new Error(`Failed to list assets: ${response.statusText}`);
    const data = await response.json();
    return data.assets || [];
  }

  async getBalance(): Promise<Record<string, AssetBalance>> {
    const response = await fetch(`${this.baseUrl}/v1/taproot-assets/assets/balance?asset_id=true`);
    if (!response.ok) throw new Error(`Failed to get balance: ${response.statusText}`);
    const data = await response.json();
    return data.asset_balances || {};
  }

  async listAddresses(): Promise<Address[]> {
    const response = await fetch(`${this.baseUrl}/v1/taproot-assets/addrs`);
    if (!response.ok) throw new Error(`Failed to list addresses: ${response.statusText}`);
    const data = await response.json();
    return data.addrs || [];
  }

  async getTransfers(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/v1/taproot-assets/assets/transfers`);
    if (!response.ok) throw new Error(`Failed to get transfers: ${response.statusText}`);
    return response.json();
  }
}

export const taprootAPI = new TaprootAPI();

// Re-export types for clarity
export type { Asset, AssetBalance, Address };