import sys
import pandas as pd

supported_types = ['csv','json','parquet']

if (len(sys.argv) != 3):
    raise Exception("Invalid Arguments \nSpecified format is: python3 transform.py [path_to_source_file] [path_to_destination_file]")

source = sys.argv[1]
dest = sys.argv[2]

source_ext = source.split('.')[-1]
dest_ext = dest.split('.')[-1]

if(source_ext in supported_types and dest_ext in supported_types and source_ext != dest_ext):
    print(f"Transforming .{source_ext} to .{dest_ext}...")
elif(source_ext == dest_ext):
    raise Exception("Cannot transform same file type")
else:
    raise Exception("Unsupported File Type\nSupported file types are: .csv, .json, .parquet")


if (source_ext == 'csv'):
    if(dest_ext == 'json'):
        df = pd.read_csv(source)
        df.to_json(dest,orient='records')
    else:
        df = pd.read_csv(source)
        df.to_parquet(dest)
        
elif (source_ext == 'json'):
    if(dest_ext == 'csv'):
        df = pd.read_json(source)
        df.to_csv(dest)
    else:
        df = pd.read_json(source)
        df.to_parquet(dest)
        
else:
    if(dest_ext == 'csv'):
        df = pd.read_parquet(source)
        df.to_csv(dest)
    else:
        df = pd.read_parquet(source)
        df.to_json(dest)
    
print("Transformed successfully!")