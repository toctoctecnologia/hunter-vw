export interface Property {
  id: number;
  code: string;
  type: string;
  title: string;
  city: string;
  state: string;
  price: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  parking: string;
  status: string;
  imageUrl: string;
  lastContactAt?: string;
  [key: string]: any;
}

export default Property;
