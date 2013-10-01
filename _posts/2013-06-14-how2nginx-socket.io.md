---
layout: post
title: "how2nginx ur socket.io"
---

(or, in my case, engine.io, but it's pretty much the same.)

Recently, I decided to install nginx on my webserver. I used to be running a
[custom proxy](https://github.com/jesusabdullah/my-little-proxy) based on
[node-http-proxy](https://github.com/nodejitsu/node-http-proxy), but then I
realized that all my servers were doing static hosting with
[ecstatic](https://github.com/jesusabdullah/node-ecstatic) and I figured it made
*way* more sense to use something actually designed to handle static
fileserving. Wherein [nginx](http://nginx.org) came into play.

Honestly, nginx is pretty awesome. The configs are Actually Sane unlike Apache,
and it's totally SO fast. Not that I really know what I'm talking about here,
but... I dig it.

But then, I had an internal dashboard I wanted to run that uses engine.io.

Back in the day, nginx didn't support websockets. Heck, very few of the reverse
proxying solutions at the time supported them. You may recall that this is
part of the reason [nodejitsu](http://jit.su) wrote node-http-proxy in the
first place. But nowadays,
[nginx fully supports websockets](http://nginx.com/news/nginx-websockets.html).
Which is badass. You can read a little bit about how to set up basic websocket
support [here](http://nginx.org/en/docs/http/websocket.html).

Problem is, that doesn't quite work for socket.io. My understanding is that this
is because the polling transport has *slightly* different requirements than
websockets when it comes to proxying. I Googled for some time about this, but
unfortunately
[all the gists on github](https://gist.github.com/search?q=nginx+socket.io) are
about how to hack together the ol' 'tcp proxying' workaround.

Luckily, [Guillermo](https://twitter.com/rauchg) is straight awesome, and
[LearnBoost](https://www.learnboost.com/) is using nginx + websockets in
production, so he was able to help me out.

Here's (more or less) the config I came up with, which *totally works*:

    server {
      server_name this-uses-websockets.jesusabdullah.net;
      access_log /var/log/nginx/this-uses-websockets.jesusabdullah.net.log main;
     
      location / {
     
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_http_version 1.1;
     
        proxy_pass http://localhost:1338;
      }
    }

Here are the salient features, as I understand it:

* `proxy_pass` is the server you want to proxy to. This is pretty standard.
* `proxy_http_version` needs to be set to 1.1 for websockets to work. 1.0 won't
  cut the mustard.
* The `Upgrade` and `Connection` headers are used to initiate websocket
  upgrades, so these are crucial.
* Finally: The `Host` header was what was missing from the
  [nginx example](http://nginx.org/en/docs/http/websocket.html), and is what
  breaks engine.io if not set.

# [HERE'S A LINK TO A DEMO USING ETHERPAD](http://etherpad.jesusabdullah.net/p/this-is-the-remix)

Enjoy, I hope this was helpful, and remember: Guillermo Rauch rocks.
