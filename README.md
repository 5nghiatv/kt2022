
===========================================
echo $PATH  ( Xem PATH )
you need to add or edit a .zshrc file or a .bash_profile or .bashrc in your home directory
touch .zshrc
nano .zshrc ( add:  export PATH=$PATH:/Users/yourusername/bin)
# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH
refresh the .zshrc : source .zshrc
================
ERROR: EACCES: permission denied, access '/usr/local/lib/node_modules/
== Chỉ cần run: sudo chown -R $(whoami) /usr/local/bin /usr/local/lib /usr/local/include /usr/local/share
mkdir ~/.npm-global ( /Users/your-user-name/. bash_profile )
npm config set prefix '~/.npm-global'
== Nhập mật khẩu xong sẽ cho run:  npm i -g xxxxx 
sudo nano ~/.bash_profile  ==>
( Paste :  export PATH=~/.npm-global/bin:$PATH )
# Save the file in nano by clicking ‘control’ +’o’ and confirming the name of the file is .zshrc by hitting return. And the ‘control’+’x’ to exit nano.
source ~/.bash_profile  ( RUN file refresh config)
# you can use the corresponding ENV variable (e.g. if you don't want to modify ~/.bash_profile):
NPM_CONFIG_PREFIX=~/.npm-global
===========================================
Command (or Cmd) ⌘   Shift ⇧  Option (or Alt) ⌥ 
Control (or Ctrl) ⌃   Caps Lock ⇪  Fn
Option-Command-Esc: Force quit an app.
===========================================

rm -r node_modules
npm install
npm -v || yarn -v
git --version
vue -V
heroku ps -a kt2022  - Xem số giờ sử dụng trong tháng / 550h+450h = 1000h
===========================================

docker-compose down
docker-compose up -d

docker rm -f $(docker ps -a -q)


docker network prune
docker volume prune
docker container prune
docker image prune


docker network create todo-app

docker run -d `
     --network todo-app --network-alias mysql `
     -v todo-mysql-data:/var/lib/mysql `
     -e MYSQL_ROOT_PASSWORD=secret `
     -e MYSQL_DATABASE=todos `
     mysql:5.7

docker run -it --network todo-app nicolaka/netshoot
dig mysql

docker run -dp 3000:3000 `
   -w /app -v "$(pwd):/app" `
   --network todo-app `
   -e MYSQL_HOST=mysql `
   -e MYSQL_USER=root `
   -e MYSQL_PASSWORD=secret `
   -e MYSQL_DB=todos `
   node:12-alpine `
   sh -c "yarn install && yarn run dev"


docker exec -it lamp-database mysql -u root -p
GRANT ALL PRIVILEGES ON *.* TO 'docker'@'%'; flush privileges; exit;

docker exec -it lamp-redis bash


redis-cli ping ---> PONG
redis-cli ---> 127.0.0.1:6379>set mykey somevalue
127.0.0.1:6379>get mykey---> somevalue


root@85b888b19591:/# echo $MYSQL_ROOT_PASSWORD ---> secret
docker inspect 85b888b19591 ( xem thong so da tao lap )

GRANT ALL PRIVILEGES ON *.* TO 'docker'@'%';
ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'tiger';
flush privileges;


docker exec -it c22e4a4790e6 mysql -p todos
select * from todo_items;

*-----------------------------------
+ npm install -g yo
+ npm install -g generator-express
+ yo nodeapp

-npm install -g @vue/cli
-vue create client
The client vue app will be making api calls to the nodeapp(server) over cors. You can client app by running
-cd client
-npm run serve

*-----------------------------------

  "engines": {
    "node": ">= 12.x",  --- Heroku sửa lại : "node": "= 16.x"
    "npm": ">= 6.x"
  },


in GIT bash backup extens VSC
========================================
<!-- Upload những thiết đặt, extensions đã cài cho VSCode
Dùng phím tắt ====> Shift + Alt + U 
hoặc search từ command Palette, search từ sync ,Nó sẽ yêu cầu nhập giá trị token vừa mới tạo

Download các thiết từ gist về
Dùng phím tắt ====> Shift + Alt + D 
hoặc gọi từ command palette , Nó sẽ yêu cầu nhập lại token và gist id đã tạo, điền vào, xong!  -->

Extensions Added:
  autoimport v1.5.4
  code-settings-sync v3.4.3
  code-spell-checker v2.2.3
  html-snippets v0.2.1
  LiveServer v5.7.5
  npm-intellisense v1.4.2
  path-intellisense v2.8.1
  prettier-vscode v9.5.0
  remote-containers v0.238.3
  rest-client v0.25.0
  theme-cobalt2 v2.2.5
  vetur v0.35.0
  vscode-docker v1.22.0
  vscode-eslint v2.2.2
  vscode-icons v11.12.0
  vscodeintellicode v1.2.22
--------------------
========================================

// app.use(cors());
const corsOptions = {
    credentials: true,
    origin: true
};
app.use(cors(corsOptions));

rm -rf node_modules

checkClick(e) {
      // Khi click ngoài cửa sổ hiện hành thì e.target = <div> ngoài cùng = this.$refs.invoiceWrap
      if (e.target === this.$refs.invoiceWrap) {
        this.TOGGLE_MODAL();
      }
},

process.cwd() 
================================= Biên dịch
Terminal 1: npm run server
Terminal 2: npm run dev
Terminal 3: node || node test

============== 
git init  ( email: nghia@XuanMai-Coprt -user.name "nghiatv" - pasw: 1186)
heroku create || update (new version)
heroku login (https://dashboard.heroku.com/apps  user: 5nghiatv@gmail.com)
==============
git add .
git commit -m "My commit"
git pull origin main ('KHO XÓA MẤT THƯ MỤC & CÀI LẠI')
git push origin main
git push heroku main
heroku restart
heroku logs --tail
$ heroku login
=================================

CỜ QUỐC TẾ
https://www.flaticon.com/packs/countrys-flags

<button id="myBtn" onclick="javascript:alert('Hello World!')">Button</button>

https://www.dropbox.com/home  ( 5nghiatv@gmail.com - Tranmeji1 )
More information DROPBOX :  https://www.dropbox.com/developers/apps/info/hast0wop1zlpix2
App folder name: Ketoan_api
App key: hast0wop1zlpix2
App secret: vjsjo7x0kfnjnj3
Generated access token: -XlMmjH21O4AAAAAAAAAASymiphcJ1MlQDiNZrBTsQDdjuz0HHfqW5NXS0EoHz00



https://coreui.io/vue/docs/components/form-components.html#shared-props-and-slots

import db from 'mongoose'

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex: true, //this is the code I added that solved it all
  keepAlive: true,
  poolSize: 10,
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
  useFindAndModify: false,
  useUnifiedTopology: true
}


https://coreui.io/vue/docs/components/icon.html

https://panjiachen.github.io/vue-element-admin-site/guide/#browsers-support

heroku addons:create cleardb:ignite
heroku config:get CLEARDB_DATABASE_URL
heroku addons:create jawsdb
heroku config:get JAWSDB_URL
heroku addons:destroy jawsdb

SET ADD in php.ini [ session.gc_maxlifetime=4440 ]  ( TĂNG THỜI GIAN CHỜ)
SET VAR lock_wait_timeout IN  phpMyadmin - Tăng lên 186

If using Cpanel/WHM the location of file [ config.default.php ] is under
/usr/local/cpanel/base/3rdparty/phpMyAdmin/libraries
and you should change the $cfg['ExecTimeLimit'] = 300; to $cfg['ExecTimeLimit'] = 0;

$ echo web: vendor/bin/heroku-php-apache2 public/ > Procfile
$ git add .
$ git commit -m "Procfile for Heroku“
$ heroku login
$ heroku create
$ git push heroku master
$ heroku open
$ heroku logs --tail
$ heroku -v --> heroku/7.47.12 win32-x86 node-v12.16.2


Symbols Supported by HTML: KÝ TỰ ĐẶC BIỆT : https://www.w3schools.com/html/html_symbols.asp

https://github.com/settings/applications/931046

https://developer.twitter.com/en/apps/15969912

https://console.developers.google.com/apis/credentials/oauthclient/271501131852-iub5i5db2ggac8nrh8g0jk19d2tlv5nh.apps.googleusercontent.com?authuser=1&folder=&organizationId=&project=ketoan-acn1

https://console.developers.google.com/apis/credentials?project=ketoan-218707&folder=&organizationId=

<input type="password" id="psw" name="psw" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required>

//let url = "user"  // user -> current == users -> All user == user/:_id : user._id (return : User)

npm i --save -dev nodemo

Thư viện ICON : https://www.bookstack.cn/read/Element-UI-vue/11.md
<%= isDisabled %>
vào node nhập : require('crypto').randomBytes(64).toString('hex')

# CoreUI Free Vue Bootstrap Admin Template

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=CoreUI%20-%20Free%20Vue%20Admin%20Template%20&url=http://coreui.io/vue/&hashtags=bootstrap,admin,template,dashboard,panel,free,angular,react,vue)
[![NPM][npm-coreui-vue-badge-latest]][npm-coreui-vue]
[![Downloads](https://img.shields.io/npm/dm/@coreui/vue.svg?style=flat-square)][coreui]
[![Vue](https://img.shields.io/badge/Vue-^2.6.11-brightgreen.svg?style=flat-square)][coreui]

[npm-coreui-vue]: https://www.npmjs.com/package/@coreui/vue
[npm-coreui-vue-badge-latest]: https://img.shields.io/npm/v/@coreui/vue/latest?style=flat-square&color=brightgreen  
[coreui]: https://coreui.io/vue

![Template](https://coreui.io/images/github/vue-free-template-3.gif)

## Description

Why we decided to create CoreUI? Please read this article: [Jack of all trades, master of none. Why Boostrap Admin Templates suck.](https://medium.com/@lukaszholeczek/jack-of-all-trades-master-of-none-5ea53ef8a1f#.7eqx1bcd8)

**This is not just another Admin Template.** It goes way beyond hitherto admin templates thanks to:

- Wonderful styling delivered by bootstrap compatible css library [CoreUI](https://coreui.io/docs/3.0-beta/),
- Dedicated [component library](https://coreui.io/vue/docs/),
- Dedicated vue tooling libraries ([coreui-vue-chartjs](https://coreui.io/vue/docs/components/charts), [coreui-icons-vue](https://github.com/coreui/coreui-icons-vue)),
- Over 500 [free svg icons](https://coreui.io/icons) consistent with our styling,
- Transparent code and file structure
- Possibility of extension to [pro version](https://coreui.io/vue) which offers even more!

CoreUI is meant to be the UX game changer. Pure & transparent code is devoid of redundant components, so the app is light enough to offer ultimate user experience. This means mobile devices also, where the navigation is just as easy and intuitive as on a desktop or laptop. The CoreUI Layout API lets you customize your project for almost any device – be it Mobile, Web or WebApp – CoreUI covers them all!

**NOTE:** Please remember to star this project to get new versions updates of this template.

### Demo

A fully functional demo is available at [CoreUI](http://coreui.io/vue/)

### Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Versioning](#versioning)
- [Our other products](#our-other-products)
- [Community](#community)
- [Community Projects](#community-projects)
- [License](#copyright-and-license)
- [Support CoreUI Development](#support-coreui-development)

### Installation

#### Clone repo

``` bash
# clone the repo
$ git clone https://github.com/coreui/coreui-free-vue-admin-template.git CoreUI-Vue

# go into app's directory
$ cd CoreUI-Vue

# install app's dependencies
$ npm install
```

#### Usage

``` bash
# serve with hot reload at localhost:8080
npm run serve

# build for production with minification
npm run build

# run linter
npm run lint

# run unit tests
npm run test:unit

# run e2e tests
npm run test:e2e

```

For a detailed explanation on how things work, check out the [Vue CLI Guide](https://cli.vuejs.org/guide/).

### Documentation

CoreUI tools documentation:

- Components documentation: [CoreUI Vue library](https://coreui.io/vue/docs)
- Styles documentation: [CoreUI styles](https://coreui.io/docs/3.0-beta/)
- Icons documentation: [CoreUI Icons](http://coreui.io/icons)

### Bugs and feature requests

Have a bug or a feature request? [Please open a new issue](https://github.com/coreui/coreui-free-vue-admin-template/issues).

### Contributing

Please read through our [contributing guidelines](https://github.com/coreui/coreui-free-vue-admin-template/blob/master/.github/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

### Versioning

For transparency into our release cycle and in striving to maintain backward compatibility,CoreUI Free Admin Template is maintained under [the Semantic Versioning guidelines](http://semver.org/).

See [the Releases section of our project](https://github.com/coreui/coreui-free-vue-admin-template/releases) for changelogs for each release version.

### Our other products

CoreUI is built on top of Bootstrap 4 and supports popular frameworks.

#### Free version products

* [CoreUI Free Bootstrap Admin Template](https://github.com/coreui/coreui-free-bootstrap-admin-template)
* [CoreUI Free Angular Admin Template](https://github.com/coreui/coreui-free-angular-admin-template)
* [CoreUI Free Laravel Admin Template](https://github.com/coreui/coreui-free-laravel-admin-template)
* [CoreUI Free React.js Admin Template](https://github.com/coreui/coreui-free-react-admin-template)
* [CoreUI Free Vue.js Admin Template](https://github.com/coreui/coreui-free-vue-admin-template)
* [CoreUI Free Vue.js + Laravel Admin Template](https://github.com/coreui/coreui-free-vue-laravel-admin-template)

#### Pro version products

* 💪  [CoreUI Pro Bootstrap Admin Template](https://coreui.io/pro/)
* 💪  [CoreUI Pro Angular Admin Template](https://coreui.io/pro/angular)
* 💪  [CoreUI Pro Laravel Admin Template](https://coreui.io/pro/laravel)
* 💪  [CoreUI Pro React Admin Template](https://coreui.io/pro/react)
* 💪  [CoreUI Pro Vue Admin Template](https://coreui.io/pro/vue)
* 💪  [CoreUI Pro Vue + Laravel Admin Template](https://coreui.io/pro/vue-laravel)

## CoreUI PRO Vue.js Admin Templates

| Default Theme | Legacy Theme | Dark Layout |
| --- | --- | --- |
| [![CoreUI Pro Bootstrap Admin Template](https://coreui.io/images/mockups/mockup_3_1_default.png)](https://coreui.io/pro/vue/) | [![CoreUI Pro Bootstrap Admin Template](https://coreui.io/images/mockups/mockup_3_1_legacy.png)](https://coreui.io/pro/vue/)| [![CoreUI Pro Bootstrap Admin Template](https://coreui.io/images/mockups/mockup_3_1_dark.png)](https://coreui.io/pro/vue/)

## Community

Get updates on CoreUI's development and chat with the project maintainers and community members.

- Follow [@core_ui on Twitter](https://twitter.com/core_ui).
- Read and subscribe to [CoreUI Blog](https://coreui.ui/blog/).

### Community Projects

Some of projects created by community but not maintained by CoreUI team.

- [NuxtJS + Vue CoreUI](https://github.com/muhibbudins/nuxt-coreui)
- [Colmena](https://github.com/colmena/colmena)

## Copyright and license

Copyright 2020 creativeLabs Łukasz Holeczek. Code released under [the MIT license](https://github.com/coreui/coreui-free-vue-admin-template/blob/master/LICENSE).
There is only one limitation - you cannot re-distribute the `CoreUI` as stock nor if you modify the `CoreUI`. In the past we faced some problems with persons who tried to sell `CoreUI` based templates.

## Support CoreUI Development

CoreUI is an MIT licensed open source project and completely free to use. However, the amount of effort needed to maintain and develop new features for the project is not sustainable without proper financial backing. You can support development by buying [PRO version](https://coreui.io/pro/).


# CoreUI PRO Vue Admin Template v4

CoreUI is meant to be the UX game changer. Pure & transparent code is devoid of redundant components, so the app is light enough to offer ultimate user experience. This means mobile devices also, where the navigation is just as easy and intuitive as on a desktop or laptop. The CoreUI Layout API lets you customize your project for almost any device – be it Mobile, Web or WebApp – CoreUI covers them all!

## Table of Contents

* [Versions](#versions)
* [Quick Start](#quick-start)
* [Installation](#installation)
* [Basic usage](#basic-usage)
* [What's included](#whats-included)
* [Documentation](#documentation)
* [Versioning](#versioning)
* [Creators](#creators)
* [Community](#community)
* [Copyright and License](#copyright-and-license)

## Versions

**Only customers with [Enterpise Membership Plan](https://coreui.io/pro/#buy) have access to private github CoreUI Pro repository.**

* 💪  [CoreUI Pro Bootstrap Admin Template](https://coreui.io/pro/)
* 💪  [CoreUI Pro Angular Admin Template](https://coreui.io/pro/angular)
* 💪  [CoreUI Pro React Admin Template](https://coreui.io/pro/react)
* 💪  [CoreUI Pro Vue Admin Template](https://coreui.io/pro/vue)

## Quick Start

- [Download the latest release](https://github.com/coreui/coreui-pro-vue-admin-template/archive/refs/heads/main.zip)
- Clone the repo: `git clone https://github.com/coreui/coreui-pro-vue-admin-template.git`

### Instalation

``` bash
$ npm install
```

or

``` bash
$ yarn install
```

### Basic usage

``` bash
# dev server with hot reload at http://localhost:3000
$ npm run serve
```

or 

``` bash
# dev server with hot reload at http://localhost:3000
$ yarn serve
```

Navigate to [http://localhost:3000](http://localhost:3000). The app will automatically reload if you change any of the source files.

#### Build

Run `build` to build the project. The build artifacts will be stored in the `build/` directory.

```bash
# build for production with minification
$ npm run build
```

or

```bash
# build for production with minification
$ yarn build
```

## What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

```
coreui-pro-vue-admin-template
├── public/          # static files
│   └── index.html   # html template
│
├── src/             # project root
│   ├── assets/      # images, icons, etc.
│   ├── components/  # common components - header, footer, sidebar, etc.
│   ├── layouts/     # layout containers
│   ├── scss/        # scss styles
│   ├── router       # routes config
│   └── store        # template state example 
│   ├── views/       # application views
│   ├── _nav.js      # sidebar navigation config
│   ├── App.vue
│   ├── ...
│   └── main.js
│
└── package.json
```

## Documentation

The documentation for the CoreUI Admin Template is hosted at our website [CoreUI for Vue](https://coreui.io/vue/)

## Versioning

For transparency into our release cycle and in striving to maintain backward compatibility, CoreUI Free Admin Template is maintained under [the Semantic Versioning guidelines](http://semver.org/).

See [the Releases section of our project](https://github.com/coreui/coreui-pro-vue-admin-template/releases) for changelogs for each release version.

## Creators

**Łukasz Holeczek**
* <https://twitter.com/lukaszholeczek>
* <https://github.com/mrholek>
* <https://github.com/coreui>

**CoreUI team**
* https://github.com/orgs/coreui/people

## Community

Get updates on CoreUI's development and chat with the project maintainers and community members.

- Follow [@core_ui on Twitter](https://twitter.com/core_ui).
- Read and subscribe to [CoreUI Blog](https://blog.coreui.ui/).

## Copyright and license

Copyright (c) 2021 creativeLabs Łukasz Holeczek

This is commercial software. To use it, you have to own a commercial license.
