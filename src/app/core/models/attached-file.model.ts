export interface AttachedFile {
  id: number;          // temporary local id for UI management
  docId?: number;      // real document ID returned by backend upload
  name: string;
  type: string;
  size: number;
  icon: string;
}
