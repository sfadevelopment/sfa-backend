##To Launch

- Create account on parse.com.
- Create an app online
- Set up parse cli, read [here](https://parse.com/apps/quickstart#cloud_code/)
- Fix config to point to correct play TODO

-  
  ```sh
  cd project_dir
  parse develop
  ``` 
  and everything should be deployt on the server



## Install

```sh
npm install gulp-cli -g
npm install bower -g
npm install
bower install
```

## Run development mode

```
gulp develop
```
On development mode after `css` or `js` file change everything will be concated automatically


## Run prod mode

```
gulp prod
```


###IMPROTANT
For deploy to prod you should use different parse SDK version, othervise payments won't work.
More info: http://stackoverflow.com/questions/32544979/parse-stripe-ios-main-js

Before deploy just execute:
```
parse jssdk 1.5.0
```
