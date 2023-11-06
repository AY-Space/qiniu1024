FROM elasticsearch:8.10.4

# 安装IK中文分词插件
RUN ./bin/elasticsearch-plugin install --batch https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v8.10.4/elasticsearch-analysis-ik-8.10.4.zip

CMD ["elasticsearch"]