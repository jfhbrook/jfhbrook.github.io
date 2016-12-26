---
layout: post
title: "Promises Context-Passing Pattern Thing"
---

Since I wrote my [promises vs async](https://jfhbrook.github.io/2014/09/26/promises-vs-async.html) article, I've learned quite a bit about promises by using them to do non-trivial work in production, and there's a lot of good bits and pieces I missed. A lot of them are covered by other people well enough, but this is one I learned somewhere along the way that I don't see people talk a lot.

For the sake of argument, let's say we want to refactor this code I just totally made up:

    getPost().then((post) => {
      return post.getContributor().then((contributor) => {
        return contributor.getPhoto().then((photo) => {
          return post.doCoolThingWith(contributor, photo);
        });
      })
    });

What this code actually *accomplishes* isn't too important (I certainly hope you don't hold me to that standard here!) but the important thing is this: In order to do line 4 in the middle, you have to have a handle on the post, contributor, *and* photo! Starting out with promises, it's really easy to run into this situation and wonder why callback hell didn't go away.

When I learned this it was called a "context". I think this comes from the idea of an execution context a la threads. Not to be confused with `this`! If you have a better suggestion for what this should be called do let me know in the comments! :v

Because this case is pretty simple, the gains of this refactor might seem a wash at best but here we go:

    Promise.resolve({}).then((ctx) => {
      return getPost().then((post) => {
        ctx.post = post;
        return ctx;
      });
    }).then((ctx) => {
      return ctx.post.getContributor().then((contributor) => {
        ctx.contributor = contributor;
        return ctx;
      });
    }).then((ctx) => {
      return ctx.contributor.getPhoto().then((photo) => {
        ctx.photo = photo;
        return ctx;
      });
    }).then((ctx) => {
      return ctx.post.doCoolThingWith(ctx.contributor, ctx.photo);
    });

"Now there are even more callbacks!" you say. It's true. But notice a few kinda cool properties:

1. For cases where you need 3 or more collected Things, this leads to less indentation--as far as I can tell this creates exactly 2 levels of indentation regardless of what's being refactored.
2. There's now this cool object that can be used to represent different states of a process, including methods.

This latter point is particularly cool. For an example, I once worked on an endpoint that would run through a batch process, logging results both to our internal logs and to the response body of the endpoint. It looked something like this:

    const ctx = {
      _log: [],
      log: (data) => { _log.push(data); bunyan.log(data); }
    };

    Promise.resolve(ctx)
      .then(doThing) // these functions call ctx.log internally
      .then(doSomeOtherthing)
      .then(yetSomethingElse)
      .then(riggleTheDoggs)
      .then(reticulateSplines)
      .then(fooTheBars)
      .then(whatever)
      .then((ctx) => {
        res.json({
          result: ctx.result,
          log: ctx._log
        });
      })
    ;

It works well! It's probably my number one trick for reducing nesting in promise code, possibly ahead of using named functions.
