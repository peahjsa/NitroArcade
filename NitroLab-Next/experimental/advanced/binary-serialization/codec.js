// Pack and unpack unsigned 16-bit scores into binary data.
export function packScore(score){const b=new ArrayBuffer(2);new DataView(b).setUint16(0,score,true);return new Uint8Array(b)}
export function unpackScore(bytes){return new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength).getUint16(0,true)}
