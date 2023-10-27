# modeken-ticket-system

## 初起動の注意点
1. yarnを実行していただく必要があります
```
cd front/modeken-system
yarn
```
yarnを自身で用意していただく必要があります

2. `.env`を作成(Topに作る)
```
touch .env
```
- .envの中身
```.env
MONGODB_USER=user # userをデフォルト値で取る
MONGODB_PASSWORD=password # passwordをデフォルト値でとる
BASIC_AUTH_NAME=User # 必須
BASIC_AUTH_PASSWORD=Password # 必須
URI_WSS=wss://192.168.0.3/
URI_FRONT=https://192.168.0.3/
URI_BACK=https://192.168.0.3/
WEBSOCKET_USER=user # userをデフォルト値で取る
WEBSOCKET_PASSWORD=password # passwordをデフォルト値で取る
NUMBER_OF_ITEM_KIND=2 # 2をデフォルト値で取る
ROOT_PATH=/api/v1.0 # /api/v1.0をデフォルト値で取る
```
**IPアドレスの部分はご使用のFQDNに置き換える点に注意してください**

3. 起動
- フォアグラウンドで起動
```bash
docker compose up
```
- デタッチモードで起動(バックグラウンドで起動)
```bash
docker compose up -d
```

4. アクセス\
`https://localhost`でアクセスできるようになります。
