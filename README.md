<p align="center">
  <img src="https://raw.githubusercontent.com/Thomas-X/jsonapi-mock/master/jsonapi.jpg" alt="jsonapi mock"/>
</p>
<br/> 
<br/>

### Setup a [jsonapi](http://jsonapi.org/) mock server in **almost** no time! Uses [lowdb](https://github.com/typicode/lowdb) ⚡️

# Usage and 'installing'
Since I plan on updating this as much as possible, use `npx` instead of installing it via `npm` globally. 
```
npx jsonapi-mock --port 3004 --watch db.json
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
Simple. The concept of this project is; Keep it simple *like* [json-server](https://github.com/typicode/json-server), but with jsonapi support and more neat features on top of [json-server](https://github.com/typicode/json-server).

# Contributing
If you find something that you think should be in the project or want to have a go at contributing, open an issue or make a PR!

# To do
+ why this package above something that's more extensive than json-server? ✅
+ check return values and status codes on different methods (PATCH, DELETE) etc..
+ query operators on routes, sorting etc
+ nested routes
+ better status code responses compliant to jsonapi spec
+ add links, relationships, included, self and meta support
+ improve project structure
+ keep improving docs
+ add more examples in docs
+ if header is not jsonapi compliant, return error with status code 415
+ check if db.json is valid jsonapi.org spec on load
+ add more fun stuff
