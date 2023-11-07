'''
upload videos to qiniu
'''

import json
import os
import threading
import logging
from qiniu import Auth, put_file
from dotenv import load_dotenv
import requests
from retry import retry

# load_dotenv()

# ACCESS_KEY = os.getenv("QINIU_ACCESS_KEY")
# SECRET_KEY = os.getenv("QINIU_SECRET_KEY")
# BUCKET_NAME = os.getenv("QINIU_BUCKET")

# q = Auth(ACCESS_KEY, SECRET_KEY)

# result = []
#
# for root, _, files in os.walk('videos'):
#     for file in files:
#         if file.endswith('flv'):
#             print(file)
#             full_path = os.path.join(root, file)
#             token = q.upload_token(BUCKET_NAME, file, 5 * 60)
#             ret, info = put_file(
#                 token,
#                 file,
#                 file_path=full_path,
#                 version='v2',
#             )
#             result.append({
#                 "ret": ret,
#                 "info": json.loads(info.text_body),
#             })
#             print(info)

# data = ''''''

# class Task(threading.Thread):
#     '''
#     task
#     '''

#     def __init__(self, lst: list) -> None:
#         self.lst = lst
#         super().__init__()

#     def run(self) -> None:
#         for i in self.lst:
#             print(self.name,end=' -> ')
#             get_url(i)

# @retry(logger=logging.Logger(name='Logger'))
# def get_url(url:str)->None:
#     print(url)
#     content = requests.get(url,timeout=None).content
#     name = url.split('/').pop()
#     full_path = f'tmp/{name}'
#     with open(full_path,'wb+') as f:
#         f.write(content)

# with open('./scripts/2.json','r',encoding='utf-8')as f:
#     data = json.loads(f.read())


# urls = [d['coverUrl'] for d in data]

# tasks = [
#     Task(urls[:200]),
#     Task(urls[200:]),
# ]
# for task in tasks:
#     task.start()
