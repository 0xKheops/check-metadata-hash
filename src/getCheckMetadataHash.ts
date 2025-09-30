export const getCheckMetadataHash = (metadataHash: Uint8Array | null) => ({
  value: Uint8Array.from([metadataHash ? 1 : 0]),
  additionalSigned: Uint8Array.from(metadataHash ? [1, ...metadataHash] : [0]),
});
