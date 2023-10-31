'''
convert.py
'''

import json
import os

DEFAULT_BANNER = 'http://i0.hdslb.com/bfs/space/cb1c3ef50e22b6096fde67febe863494caefebad.png'


def convert_user(user_json: list[dict]) -> list[dict]:
    '''
    pick up user
    '''
    result = []
    for i in user_json:
        d = {
            'id': str(i['mid']),
            'name': i.get('name', i['uname']),
            'email': f"{i['mid']}@example.com",
            'bio': i['sign'],
            'avatarUrl': i.get('face', i['avatar']),
            'bannerUrl': i.get('top_photo', DEFAULT_BANNER),
        }
        result.append(d)
    return result


def list_videos_json(directory: str):
    '''
    get **/video.json
    '''
    video_json_paths = []

    # 遍历指定文件夹
    for root, _, files in os.walk(directory):
        for file in files:
            # 检查文件名是否为 'videos.json'
            if file == "videos.json":
                full_path = os.path.join(root, file)
                video_json_paths.append(full_path)
    return video_json_paths


def convert_video(video_json: list[dict]) -> list[dict]:
    '''
    pick up video
    '''
    result = []
    for i in video_json:
        d = {
            'id': str(i['bvid']),
            'title': i['title'],
            'description': i['description'],
            'url': '',  # Placeholder, as it's not in the JSON
            'coverUrl': i['pic'],
            'createdAt': i['created'],
            'views': i['play'],
            'authorId': str(i['mid'])
        }
        result.append(d)
    return result


def convert_video_tag(video_tag_json: list[dict]) -> list[dict]:
    '''
    pick up video tag
    '''
    result = []
    for i in video_tag_json:
        for t in i['tags']:
            if t['tag_id'] == 0:
                continue
            d = {
                'tagId': str(t['tag_id']),
                'videoId': i['bvid'],
                'createdAt': t['ctime']
            }
            result.append(d)
    return result


def aid2bid(aid: int) -> str:
    """
    AV 号转 BV 号。
    """
    table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF"
    tr = {}
    for i in range(58):
        tr[table[i]] = i
    s = [11, 10, 3, 8, 4, 6]
    xor = 177451812
    add = 8728348608

    def enc(x):
        x = (x ^ xor) + add
        r = list("BV1  4 1 7  ")
        for i in range(6):
            r[s[i]] = table[x // 58**i % 58]
        return "".join(r)

    return enc(aid)


def convert_comments(raw_json: list[dict]) -> list[dict]:
    '''
    pick up comments
    '''
    result = []
    for i in raw_json:
        message: dict = i['content']
        d = {
            'id': str(i['rpid']),
            'createdAt': i['ctime'],
            'text': message['message'],
            'imgs': message.get('pictures', []),
            'authorId': str(i['mid']),
            'videoId': aid2bid(i['oid']),
            'user': convert_user([i['member']])[0]
        }
        result.append(d)
    return result


def process_followings() -> None:
    '''
    process followings
    '''
    with open('spider/followings.json', 'r', encoding='utf-8') as f:
        following_data = json.loads(f.read())
    converted_user = convert_user(following_data)
    with open('scripts/users.json', 'w+', encoding='utf-8') as f:
        f.write(json.dumps(converted_user, ensure_ascii=False, indent=4))


def process_videos() -> None:
    '''
    process videos
    '''
    videos = []
    for i in list_videos_json('videos'):
        with open(i, 'r', encoding='utf-8') as f:
            videos.extend(convert_video(json.loads(f.read())))

    with open('scripts/videos.json', 'w+', encoding='utf-8') as f:
        f.write(json.dumps(videos, ensure_ascii=False, indent=4))


def process_video_tags() -> None:
    '''
    process video tags
    '''
    with open('spider/video_tags.json', 'r', encoding='utf-8') as f:
        videos_tag = json.loads(f.read())
    converted = convert_video_tag(videos_tag)
    with open('scripts/video_tags.json', 'w+', encoding='utf-8') as f:
        f.write(json.dumps(converted, ensure_ascii=False, indent=4))


def process_comments() -> None:
    '''
    process comments
    '''
    with open('spider/comments.json', 'r', encoding='utf-8') as f:
        json_obj = json.loads(f.read())
    converted = convert_comments(json_obj)
    with open('scripts/comments.json', 'w+', encoding='utf-8') as f:
        f.write(json.dumps(converted, ensure_ascii=False, indent=4))


if __name__ == '__main__':
    os.system('cls')
    # process_followings()
    # process_videos()
    # process_video_tags()
    # process_comments()
