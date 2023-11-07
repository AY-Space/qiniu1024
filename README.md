<div align="center">

  <img id="volo" width="96" alt="volo" src=".github/image/icon.svg">

  <p>『 Volo - 短视频平台』</p>

</div>

# 📚 简介

2023 年 **七牛云校园马拉松** 参赛作品 **volo 短视频平台**
[项目架构](./docs/architecture.md)

# 📸 示例

访问在线 demo: <http://volo.ay7295.space:30123>
演示视频：<https://www.bilibili.com/video/BV1iG411971W>

# 📦 使用方式

_测试过的环境：OrbStack on M1 Mac_

复制一份 volo/.env.example
  
```shell  
  $ cp volo/.env.example volo/.env
```

复制一份 compose.yaml：

```shell
$ cp example.compose.yaml compose.yaml
```
根据配置填写 .env 文件。 **!!! 必须保证docker容器中有 .env !!!**
```
DATABASE_URL="postgresql://volo:volo@db:5432/volo"

GORSE_URL="http://recommend:8088"

REDIS_URL="redis://cache:6379"

ES_URL="http://es:9200"

NEXTAUTH_SECRET="12345abcde"
NEXTAUTH_URL="http://localhost:3000"

QINIU_ACCESS_KEY="123"
QINIU_SECRET_KEY="123"
QINIU_BUCKET="volo" #要提前创建
QINIU_BASE_URL="example.com" # 七牛云 分配 的临时域名 或者是 绑定的域名
```
修改 compose.yaml 中的环境变量

```yaml
QINIU_ACCESS_KEY: # kodo access key
QINIU_SECRET_KEY: # kodo secret key
QINIU_BUCKET: # kodo bucket
QINIU_BASE_URL: # 可公开访问的 kodo bucket url（末尾不带 /）
```

保证网络通畅，运行：

```sh
$ docker-compose up
```

等待容器启动完成，访问 <http://localhost:3000> 即可

# ⏳ 进度

已完成

# 🔦 声明

1. 如自行部署，测试数据中链接的静态文件在**2023年12月1日**之后将**不再可用**
2. 在线演示 demo
   在**2023年12月1日**之后将**不可访问**
3. 本项目的示例数据部分来源于 Bilibili，如有侵权，请联系我们删除

# 🧑‍💻 贡献者

<a href="https://github.com/AY-Space/qiniu1024/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=AY-Space/qiniu1024" />
</a>
