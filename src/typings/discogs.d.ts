export interface DiscogsResponse {
  pagination: Pagination;
  releases: ReleasesItem[];
}
interface Pagination {
  page: number;
  pages: number;
  per_page: number;
  items: number;
  urls: Urls;
}
interface Urls {
  last: string;
  next: string;
}
export interface ReleasesItem {
  id: number;
  instance_id: number;
  date_added: string;
  rating: number;
  basic_information: Basic_information;
}
interface Basic_information {
  id: number;
  master_id: number;
  master_url: string;
  resource_url: string;
  thumb: string;
  cover_image: string;
  title: string;
  year: number;
  formats: FormatsItem[];
  labels: LabelsItem[];
  artists: ArtistsItem[];
  genres: string[];
  styles: string[];
}
interface FormatsItem {
  name: string;
  qty: string;
  text: string;
  descriptions: string[];
}
interface LabelsItem {
  name: string;
  catno: string;
  entity_type: string;
  entity_type_name: string;
  id: number;
  resource_url: string;
}
interface ArtistsItem {
  name: string;
  anv: string;
  join: string;
  role: string;
  tracks: string;
  id: number;
  resource_url: string;
}
