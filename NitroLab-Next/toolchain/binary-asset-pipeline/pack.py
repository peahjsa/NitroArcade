"""Pack a local asset as a simple length-prefixed binary file; Python 3 stdlib only."""
import pathlib,struct,sys
if __name__=='__main__':
 if len(sys.argv)!=3: raise SystemExit('Usage: python pack.py input.file output.npack')
 raw=pathlib.Path(sys.argv[1]).read_bytes()
 pathlib.Path(sys.argv[2]).write_bytes(b'NPK1'+struct.pack('<I',len(raw))+raw)
 print('Packed',len(raw),'bytes')
