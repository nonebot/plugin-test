<div align=center>
  <img src="src/assets/logo.png" width="200" height="200">

# nonebot-test

[![License](https://img.shields.io/github/license/nonebot/nonebot-test.svg)](LICENSE)
[![PyPI](https://img.shields.io/pypi/v/nonebot-test.svg)](https://pypi.python.org/pypi/nonebot-test)
![Python Version](https://img.shields.io/badge/python-3.7+-blue.svg)
![NoneBot Version](https://img.shields.io/badge/NoneBot-2+-9cf.svg)
[![QQ 群](https://img.shields.io/badge/qq%E7%BE%A4-768887710-orange.svg)](https://jq.qq.com/?_wv=1027&k=5OFifDh)
[![Telegram](https://img.shields.io/badge/telegram-chat-blue.svg)](https://t.me/cqhttp)
[![QQ 版本发布群](https://img.shields.io/badge/%E7%89%88%E6%9C%AC%E5%8F%91%E5%B8%83%E7%BE%A4-218529254-green.svg)](https://jq.qq.com/?_wv=1027&k=5Nl0zhE)
[![Telegram 版本发布频道](https://img.shields.io/badge/%E7%89%88%E6%9C%AC%E5%8F%91%E5%B8%83%E9%A2%91%E9%81%93-join-green.svg)](https://t.me/cqhttp_release)

</div>

## 准备开发

首先你需要安装 npm 的本地依赖：

```sh
npm install
```

**不建议单独为此项目新建虚拟环境，直接在你原有的 nonebot 虚拟环境下使用即可。**

## 进行开发

使用命令启动前端页面的开发服务器，你对前端页面的任何修改都可以预览：

```sh
npm run serve
```

这时候的页面连接不到 `nonebot2` 的实例，所以只能进行页面的开发。

下面介绍一下如何连接到已有的 `nonebot2` 项目上。

由于开启了 [`devServer`](https://cli.vuejs.org/zh/config/#devserver) 中的 `writeToDisk` 选项， `webpack-dev-server` 会将每次编译产生的文件写入 `./nonebot_test/dist` 文件夹。

打开你的 bot 源码目录以及虚拟环境，将原来已经安装的 `nonebot-test` 包移除掉：

```sh
pip uninstall nonebot-test
```

将 bot 的依赖改为本地依赖：

```diff
- nonebot-test = { version = "^0.1.0", optional = true }
+ nonebot-test = { path = "relative/path/to/nonebot-test/", develop = true }
```

然后使用 poetry 重新安装依赖即可：

```sh
poetry update
poetry install
```


现在启动你的 bot，本地`nonebot-test` 包就可以开始工作了，打开 `localhost:2333` （**不需要打开前面所述的前端开发服务器:8080**）就可以查看实时最新的前端页面了。


```sh
python bot.py
```
