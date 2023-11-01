export function uuid(radix = 36, len = -6) {
  return Math.random().toString(radix).substring(len);
}

export function mockId() {
  return `id-${uuid()}`
}

let guid = Date.now();

export function uniqueId(prefix = '') {
  return `${prefix}${(guid++).toString(36).toLowerCase()}`;
}

export function nextId(docId: string, seqId: any) {
  return `node_${(String(docId).slice(-10) + (++seqId.seqId).toString(36)).toLocaleLowerCase()}`;
}
