<div align="center">

  <img id="volo" width="96" alt="volo" src=".github/image/icon.svg">

  <p>『 Volo - 短视频平台』</p>

</div>

# 📚 简介

2023 年 **七牛云校园马拉松** 参赛作品 **volo 短视频平台**
[项目架构](./docs/architecture.md)

# 📸 示例

访问在线 [demo](http://volo.ay7295.space)
演示 视频：

# 📦 使用方式

## docker cpmpose

```shell
$ docker compose up -d
```

### 📌 注意事项

一定要先填写 compose.yaml 中 **required** 的字段

```yaml
QINIU_ACCESS_KEY: # required
QINIU_SECRET_KEY: # required
QINIU_BUCKET: # required 要提前配置好 bucket 为可以公开访问
QINIU_BASE_URL: # required 七牛云 分配的临时域名 或者是 绑定的域名
```

# ⏳ 进度

已完成

# 🔦 声明

1. 自己部署的话
   mock dataset 在**2023 年 12 月 1 日**之后将**不再可用**
2. 在线演示 demo
   在**2023 年 12 月 1 日**之后将**不可访问**

# 🧑‍💻 贡献者

<a href="https://github.com/AY-Space/qiniu1024/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=AY-Space/qiniu1024" />
</a>
