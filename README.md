<p align="center">
  <img src="https://raw.githubusercontent.com/Thomas-X/jsonapi-mock/master/jsonapi.jpg" alt="jsonapi mock"/>
</p>
<br/> 
<br/>  
<p>
<img src="http://forthebadge.com/images/badges/built-with-love.svg" alt="badge"/>
<img src="http://forthebadge.com/images/badges/contains-cat-gifs.svg" alt="badge"/>
<img src="http://forthebadge.com/images/badges/uses-js.svg" alt="badge"/>
<img src="http://forthebadge.com/images/badges/gluten-free.svg" alt="badge"/>
</p>




### Setup a [jsonapi](http://jsonapi.org/) mock server in **almost** no time! Uses [lowdb](https://github.com/typicode/lowdb)⚡️
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

# Route params and usage
Let's take the route `/posts/posts2` for our example.
If we want to get all posts2 we would do a 
```
GET /posts/posts2/
```
Responds with a `404` if the route `/posts2/posts2/` is not found. This is most likely caused by invalid route prefixing for nested routes. <br/>
Responds with a `200` if success and all the posts2 posts. <br/>
<br/>
If we want to create a post2 we would do a
```
POST /posts/posts2/
{
  "data": {
    "type": "posts2",
    "attributes": {
      "title": "JSONAPI mock is handy!",
      "description": "But there's already so many alternatives.."
    }
  }
}
```
Responds with a `400` if invalid body <br/>
Responds with a `200` and the newly created post if success<br/>
<br/>
If we want to edit a post2 post we would do a PATCH request, `6b7c4631-927d-454b-885b-8b908e19b9c1` being the ID of the item we want to change.
```
PATCH /posts/posts2/6b7c4631-927d-454b-885b-8b908e19b9c1
{
  "data": {
    "attributes": {
      "title": "JSON api paints my bikeshed!",
      "description": "It really does! Also the shortest post, we edited this! Yay!"
    }
  }
}
```
Responds with a `400` if invalid body <br/>
Responds with a `200` and the new edited post if success
<br/>
If we want to remove a post2 post we would do a DELETE request, same as a PATCH request as in that you have to pass along an ID at the end of the route as a parameter.
```
DELETE /posts/posts2/6b7c4631-927d-454b-885b-8b908e19b9c1
```
Responds with a `204` if success. <br/>
Responds with a `404` if the id of the item is not found <br/>
# Nested routes and expected structure from your watchfile (so your .json file acting as a DB)
For a non-nested route you would declare your watchfile something like this: <br/>
This is the structure we expect coming from the jsonapi spec, so nothing abnormal here, this structure has 1 route and that's
`/posts`.
```json
{
    "posts": {
        "data": [
            {
                "type": "posts",
                "id": "fcd856e4-2b35-4e18-abf7-41920cef39de",
                "attributes": {
                    "title": "Lorem ipsum",
                    "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi dicta dolorum officia sapiente. Ad alias, enim itaque iure libero maxime minus nemo, non nulla, officiis quia saepe totam veritatis voluptatem."
                }
            }
        ]
    }
}
```
For a nested route setup it's slightly different:
```json
{
    "route:posts": {
        "route:posts2": {
            "data": [
                {
                    "type": "posts2",
                    "id": "6b7c4631-927d-454b-885b-8b908e19b9c1",
                    "attributes": {
                        "title": "Lorem ipsum",
                        "description": "Lorem ipsummmmmm dolor sit amet, consectetur adipisicing elit. Animi dicta dolorum officia sapiente. Ad alias, enim itaque iure libero maxime minus nemo, non nulla, officiis quia saepe totam veritatis voluptatem."
                    }
                }
            ]
        },
        "data": [
            {
                "type": "posts",
                "id": "fcd856e4-2b35-4e18-abf7-41920cef39de",
                "attributes": {
                    "title": "Lorem ipsum",
                    "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi dicta dolorum officia sapiente. Ad alias, enim itaque iure libero maxime minus nemo, non nulla, officiis quia saepe totam veritatis voluptatem."
                }
            }
        ]
    }
}
```
You might notice the `route:` prefix on all of the routes, this is to determine whether a key in the current object is a route or not. For now the prefix is `route:`, there's a todo for changing this via a config file or in your package.json file. <br/>
This nesting can go infinitely deep (well, as far as your .json filesize allows).
# Motivation
I searched for days to find a good and dead simple jsonapi mock server, all of them required me to do all kinds of crazy stuff and learn their complicated API. I saw [json-server](https://github.com/typicode/json-server) and really liked the concept of just defining your routes and some sample data and you're good to go.

# Why? 
Simple. The concept of this project is; Keep it simple *like* [json-server](https://github.com/typicode/json-server), but with jsonapi support and more neat features on top of [json-server](https://github.com/typicode/json-server). Plus I didn't find anything that was up to my needs in terms of simplicity and wanted a challenge for myself

# Contributing
If you find something that you think should be in the project or want to have a go at contributing, open an issue or make a PR!

# To do
+ why this package above something that's more extensive than json-server? ✅
+ check return values and status codes on different methods (PATCH, DELETE) etc.. ✅
+ query operators on routes, sorting etc
+ nested routes ✅
+ better faulty nested route declaration detection instead of throwing an HTTP 404 error
+ proper dummy file with nested and not nested routes. and write documentation for nested routes. 🚧
+ config .jsonapimock or in package.json 'jsonapimockConfig' for changing the nested route prefix, the accept and content type ,although you really shouldn't change the accept or content type header ;)
+ better status code responses compliant to jsonapi spec 🚧
+ add links, relationships, included, self and meta support
+ improve project structure ✅
+ keep improving docs 🚧
+ add [faker](https://www.npmjs.com/package/faker) flag/possibility for faking data and generating all the dummy data you want
+ add more examples in docs 🚧
+ if header is not jsonapi compliant, return error with status code 415 ✅
+ check if db.json is valid jsonapi.org spec on load
+ put all errors in an errorIndex so they're nice and convenient to access and read.
+ add more fun stuff
