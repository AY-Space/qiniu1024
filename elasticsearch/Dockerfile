FROM elasticsearch:7.17.7

# 安装IK中文分词插件
RUN ./bin/elasticsearch-plugin install --batch https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.17.7/elasticsearch-analysis-ik-7.17.7.zip

CMD ["elasticsearch"]