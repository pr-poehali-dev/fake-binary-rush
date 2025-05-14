
export interface Asset {
  id: string;
  name: string;
  type: "crypto" | "forex" | "stock";
  icon: string;
}

export interface ExpirationTime {
  value: string;
  label: string;
}

export interface PricePoint {
  time: Date;
  price: number;
}

export interface Trade {
  id: string;
  asset: string;
  direction: "up" | "down";
  amount: number;
  profit: number;
  time: Date;
  expiration: string;
  status: "active" | "win" | "lose";
}
