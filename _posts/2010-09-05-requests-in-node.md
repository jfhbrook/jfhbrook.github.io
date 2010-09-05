---
layout: post
title: Making http requests in node
---

A few months ago, I set out to add a url shortener to my IRC bot, and ran into lotsa snags. I just could *not* get the thing to work! Anyways, I finally revisited it and got it to do what I want.

Here's the gist of me requesting a shortened url for google.com:

<script src="http://gist.github.com/501359.js"> </script>

Now I'll do my best to walk through it:

###lines 4 and 5:

First, we require everything we need. In this case, it's just the *http* and the *querystring* modules. The *http* module is what it sounds like; I'll cross the *querystring* bridge when I get to it.

###line 7:

We create the client on port 80.

### line 8:

*querystring.stringify()* takes a javascript object and converts it to the sort of mumbo-jumbo you would usually see after the question-mark if you were doing this via the browser. In this case:

    {url: 'www.google.com'}

turns into:

    url=www.google.com

###line 10:

Now, we make the request. The first argument is the type of request we're making---in this case, "POST." The second is the url after the base. Note that it includes the question-mark query mumbo-jumbo! The third argument is http header stuff.  Different services will require different things in the header in order to not shit themselves, but just about any service will at least need the host. Why the service doesn't know who they are, I don't know. ;)

###line 11:

Now, notice this commented section. This was my original instinct, based on the docs, but for the sort of things that are normally questionmarked, it's not what you want to do.  I think this is more where "POST"-ish information goes, but I wouldn't know. I'm no http master!

###lines 12-18:

This next bit here is just a series of EventEmitter event handlers. Request emits a response, which contains status code and header info, and has a 'data' event, which contains what we're ACTUALLY interested in.

###line 19

You have to close the request before you launch it. As the argument, you can write some parting stuff if you want, not that it helps us any. ;)

-----

Hopefully that was helpful!
