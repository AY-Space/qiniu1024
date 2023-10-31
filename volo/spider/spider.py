'''
https://nemo2011.github.io/bilibili-api/#/
'''

import asyncio
import json
import os
from bilibili_api import user, Credential, comment, video
from retry import retry
from dotenv import load_dotenv

load_dotenv()

SESSDATA = os.getenv("SESSDATA")

CREDENTIAL = Credential(sessdata=SESSDATA)


async def get_all_followings_info() -> None:
    '''
    get_all_followings_info
    '''
    u = await user.User(
        uid=174892451,
        credential=CREDENTIAL,
    ).get_all_followings()

    infos = []

    for i in u:
        infos.append(await user.User(uid=i).get_user_info())

    info = json.dumps(infos, ensure_ascii=False, indent=4)
    with open('spider/followings.json', 'w+', encoding='utf-8') as f:
        f.write(info)


# @retry(logger=print)
# async def sort_user_by_follower_top(top: int | None) -> None:
#     infos = []
#     mid2num = []
#     with open('spider/followings.json', 'r', encoding='utf-8') as f:
#         infos: list[dict] = json.loads(f.read())

#     for i in infos:
#         mid = i['mid']
#         u = await user.User(
#             uid=mid,
#             credential=CREDENTIAL,
#         ).get_all_followings()
#         mid2num.append({
#             **i,
#             "following_num": len(u),
#         })

#         mid2num = sorted(mid2num, key=lambda x: x['following_num'])
#         mid2num = mid2num[:top]

#         with open(
#                 'spider/sorted_followings.json',
#                 'w+',
#                 encoding='utf-8',
#         ) as f:
#             f.write(json.dumps(
#                 mid2num,
#                 ensure_ascii=False,
#                 indent=4,
#             ))


async def download_all() -> None:
    '''
    download_all
    '''
    infos = []
    with open('spider/followings.json', 'r', encoding='utf-8') as f:
        infos: list[dict] = json.loads(f.read())

    for i in infos[:12]:
        await get_download_user_video(uid=i['mid'])


@retry(logger=print)
async def get_download_user_video(uid: int) -> None:
    '''
    get_download_user_video
    '''
    print(f'> getting {uid}')
    u = await user.User(
        uid=uid,
        credential=CREDENTIAL,
    ).get_videos()
    u: list[dict] = u['list']['vlist']

    filtered: list[dict] = []

    for i in u:
        length: str = i['length']
        if int(length.split(':')[0]) < 10:
            filtered.append(i)

    filtered = filtered[:10]
    if len(filtered) == 0:
        return

    os.makedirs(name=f'videos/{uid}', exist_ok=True)
    with open(f'videos/{uid}/videos.json', 'w+', encoding='utf-8') as f:
        f.write(json.dumps(filtered, ensure_ascii=False, indent=4))

    for i in filtered:
        bvid = i['bvid']
        has_exist = False
        for f in os.listdir(f'videos/{uid}'):
            if f.startswith(bvid):
                print(f'{bvid} has exist')
                has_exist = True
                break
        if not has_exist:
            c = await comment.get_comments(
                oid=i['aid'],
                type_=comment.CommentResourceType.VIDEO,
                credential=CREDENTIAL,
            )
            with open(
                    f'videos/{uid}/{bvid}.json',
                    'w+',
                    encoding='utf-8',
            ) as f:
                f.write(json.dumps(c, ensure_ascii=False, indent=4))

            url = f'https://www.bilibili.com/video/{bvid}/'
            command = f'you-get \"{url}\" --debug -o videos/{uid} -O {bvid}'
            print(f'> {command}')
            os.system(command=command)
            print('> end download')

    for f in os.listdir(f'videos/{uid}'):
        if f.endswith('xml'):
            os.remove(f'videos/{uid}/{f}')


async def get_video_tags() -> None:
    '''
    get_video_tags
    '''
    videos = []
    video_tags: list[dict] = []
    tags: list[dict] = []
    result: list[dict] = []
    with open('scripts/videos.json', 'r', encoding='utf-8') as f:
        videos: list[dict] = json.loads(f.read())

    seen_ids = []
    for i in videos:
        print(i['id'])
        t = await video.Video(
            bvid=i['id'],
            credential=CREDENTIAL,
        ).get_tags()
        video_tags.append({"bvid": i['id'], 'tags': t})
        tags.extend(t)

    with open('spider/video_tags.json', 'w+', encoding='utf-8') as f:
        f.write(json.dumps(video_tags, ensure_ascii=False, indent=4))

    for i in tags:
        tag_id = i['tag_id']
        if tag_id == 0 or tag_id in seen_ids:
            continue
        seen_ids.append(tag_id)
        content = i['content']
        if content == '':
            content = None
        t = {
            "id": str(tag_id),
            "name": i['tag_name'],
            "description": content,
            "createdAt": i['ctime']
        }
        result.append(t)

    with open('scripts/tags.json', 'w+', encoding='utf-8') as f:
        f.write(json.dumps(result, ensure_ascii=False, indent=4))


def get_comments() -> None:
    '''
    get_comments
    '''
    comments: list[dict] = []
    for root, _, files in os.walk('videos'):
        for file in files:
            if file.startswith('BV') and file.endswith('json'):
                full_path = os.path.join(root, file)
                print(file)
                with open(full_path, 'r', encoding='utf-8') as f:
                    c = json.loads(f.read())['replies']
                    if c == None:
                        c = []
                    comments.extend(c)

    with open('spider/comments.json', 'w+', encoding='utf-8') as f:
        f.write(json.dumps(comments, ensure_ascii=False, indent=4))


async def main() -> None:
    '''
    main
    '''
    # await get_all_followings_info()
    # await download_all()
    # await get_video_tags()
    # get_comments()
    print('end')


if __name__ == '__main__':
    os.system('cls')
    asyncio.get_event_loop().run_until_complete(main())
