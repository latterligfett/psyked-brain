/**
 * Reads the JSON chunk of a GLB and prints every mesh name together with its
 * spatial centroid + bounding box, derived from glTF POSITION accessor
 * min/max arrays (no need to decode the binary geometry).
 *
 * GLB layout:
 *   Bytes 0-3:   magic "glTF"
 *   Bytes 4-7:   version (uint32 LE)
 *   Bytes 8-11:  total length (uint32 LE)
 *   Bytes 12-15: JSON chunk length (uint32 LE)
 *   Bytes 16-19: JSON chunk type "JSON"
 *   Bytes 20..:  JSON payload (UTF-8 text)
 *
 * Coordinate axes (glTF/Three convention, model-local — same orientation the
 * app uses after centring):
 *   x: + = right hemisphere, - = left
 *   y: + = top of brain,     - = base
 *   z: + = front (face),     - = back (occiput)
 */

const fs = require('fs');
const path = require('path');

const file = path.resolve(process.argv[2] || 'public/brain_complete.glb');
const fd = fs.openSync(file, 'r');

const header = Buffer.alloc(20);
fs.readSync(fd, header, 0, 20, 0);
const magic   = header.toString('utf8', 0, 4);
const jsonLen = header.readUInt32LE(12);
const jsonTag = header.toString('utf8', 16, 20).replace(/\0/g, '');

if (magic !== 'glTF' || jsonTag !== 'JSON') {
  console.error(`Not a valid GLB. magic=${magic} chunkTag=${jsonTag}`);
  process.exit(1);
}

const jsonBuf = Buffer.alloc(jsonLen);
fs.readSync(fd, jsonBuf, 0, jsonLen, 20);
fs.closeSync(fd);

const gltf = JSON.parse(jsonBuf.toString('utf8'));
const accessors = gltf.accessors || [];

function meshBounds(mesh) {
  // Union the POSITION accessor min/max across all primitives of the mesh.
  let min = [Infinity, Infinity, Infinity];
  let max = [-Infinity, -Infinity, -Infinity];
  let found = false;
  for (const prim of mesh.primitives || []) {
    const posIdx = prim.attributes && prim.attributes.POSITION;
    if (posIdx == null) continue;
    const acc = accessors[posIdx];
    if (!acc || !acc.min || !acc.max) continue;
    found = true;
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], acc.min[i]);
      max[i] = Math.max(max[i], acc.max[i]);
    }
  }
  if (!found) return null;
  return {
    center: [0, 1, 2].map(i => (min[i] + max[i]) / 2),
    size:   [0, 1, 2].map(i => max[i] - min[i]),
  };
}

const f = (n) => (n >= 0 ? ' ' : '') + n.toFixed(1).padStart(6, ' ');
const side = (x) => (x > 2 ? 'R' : x < -2 ? 'L' : 'mid');

const rows = (gltf.meshes || []).map((m, i) => {
  const b = meshBounds(m);
  return { i, name: m.name || `(mesh #${i})`, b };
});

console.log(`File: ${file}`);
console.log(`Meshes: ${rows.length}`);
console.log('');
console.log('  #  | side |      x       y       z   |  name');
console.log('-----+------+--------------------------+---------------------------------');
for (const r of rows) {
  if (!r.b) { console.log(`${String(r.i).padStart(3)}  |  ?   |  (no bounds)             |  ${r.name}`); continue; }
  const [x, y, z] = r.b.center;
  console.log(`${String(r.i).padStart(3)}  | ${side(x).padStart(3)}  | ${f(x)} ${f(y)} ${f(z)}  |  ${r.name}`);
}

// Focus report: the unmapped segments vs. anatomical landmarks.
console.log('\n=== FOCUS: unmapped cerebral-hemisphere segments ===');
const want = ['.002', '.003', '.004', '.005'];
const landmarks = [
  'segment of cerebral hemisphere.006', 'segment of cerebral hemisphere.007',
  'segment of cerebral hemisphere.008', 'right occipital lobe',
  'segment of cerebral hemisphere', 'segment of cerebral hemisphere.001',
  'left superior parietal lobule', 'right superior parietal lobule',
  'left superior frontal gyrus', 'right superior frontal gyrus',
];
function show(label, name) {
  const r = rows.find(rr => rr.name === name);
  if (!r || !r.b) { console.log(`  ${label}: ${name} — n/a`); return; }
  const [x, y, z] = r.b.center;
  console.log(`  ${label}: [${side(x)}] x=${x.toFixed(1)} y=${y.toFixed(1)} z=${z.toFixed(1)}  (${name})`);
}
console.log('-- unmapped --');
rows.filter(r => want.some(w => r.name.endsWith(w))).forEach(r => show('UNMAPPED', r.name));
console.log('-- landmarks --');
landmarks.forEach(n => show('landmark', n));
