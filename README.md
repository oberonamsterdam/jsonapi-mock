<p align="center">
  <img src="https://raw.githubusercontent.com/Thomas-X/jsonapi-mock/master/jsonapi.jpg" alt="jsonapi mock"/>
</p>
<br/> 
<br/>

### Setup a [jsonapi](http://jsonapi.org/) mock server in **almost** no time! Uses [lowdb](https://github.com/typicode/lowdb) ⚡️

# Usage and 'installing'
Since I plan on updating this as much as possible, use `npx` instead of installing it via `npm` globally. You can use `npx` already if you have npm@^5.2.0.
```
npx jsonapi-mock
```
OR (not recommended!)
```
npm install jsonapi-mock
```
Run this in your project folder
```
jsonapi-mock
```
Run it in the directory of the .json file you want to use as a db (i.e, your project root), otherwise it'll generate a dummy one with some sample data. Make sure your dummy data is compliant with the jsonapi spec though, see `db.json` in this repo for more info on that.

# Flags
| Flag          | Description     |  Default |
| ------------- |:-------------:|                             ---- |
| --help        | shows help with all the flags available | N/A |
| -w or --watch | watches a .json file to use as a db      | db.json |
| -p or --port | what port the server should use      | 3004 |

# Motivation
I searched for days to find a good and dead simple jsonapi mock server, all of them required me to do all kinds of crazy stuff and learn their complicated API. I saw [json-server](https://github.com/typicode/json-server) and really liked the concept of just defining your routes and some sample data and you're good to go.

# Why? 
Simple. The concept of this project is; Keep it simple *like* [json-server](https://github.com/typicode/json-server), but with jsonapi support and more neat features on top of [json-server](https://github.com/typicode/json-server). Plus I didn't find anything that was up to my needs in terms of simplicity and wanted a challenge for myself

# Contributing
If you find something that you think should be in the project or want to have a go at contributing, open an issue or make a PR!

# To do
+ why this package above something that's more extensive than json-server? ✅
+ check return values and status codes on different methods (PATCH, DELETE) etc..
+ query operators on routes, sorting etc
+ nested routes
+ better faulty nested route declaration detection instead of throwing an HTTP 404 error
+ proper dummy file with nested and not nested routes. and write documentation for nested routes.
+ config .jsonapimock or in package.json 'jsonapimockConfig' for changing the nested route prefix, the accept and content type ,although you really shouldn't change the accept or content type header ;)
+ better status code responses compliant to jsonapi spec
+ add links, relationships, included, self and meta support
+ improve project structure ✅
+ keep improving docs
+ add [faker](https://www.npmjs.com/package/faker) flag/possibility for faking data and generating all the dummy data you want
+ add more examples in docs
+ if header is not jsonapi compliant, return error with status code 415 ✅
+ check if db.json is valid jsonapi.org spec on load
+ put all errors in errorIndex
+ add more fun stuff
