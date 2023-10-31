'''
upload videos to qiniu
'''

import json
import os
from qiniu import Auth, put_file
from dotenv import load_dotenv

load_dotenv()

ACCESS_KEY = os.getenv("QINIU_ACCESS_KEY")
SECRET_KEY = os.getenv("QINIU_SECRET_KEY")
BUCKET_NAME = os.getenv("QINIU_BUCKET")

q = Auth(ACCESS_KEY, SECRET_KEY)

result = []

for root, _, files in os.walk('videos'):
    for file in files:
        if file.endswith('flv'):
            print(file)
            full_path = os.path.join(root, file)
            token = q.upload_token(BUCKET_NAME, file, 5 * 60)
            ret, info = put_file(
                token,
                file,
                file_path=full_path,
                version='v2',
            )
            result.append({
                "ret": ret,
                "info": json.loads(info.text_body),
            })
            print(info)
