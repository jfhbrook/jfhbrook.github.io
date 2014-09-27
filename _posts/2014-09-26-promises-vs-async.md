---
layout: post
title: "promises vs async (vs vanilla)"
---

Until recently, I've been blissfully unaware of promises. I didn't have a
problem with callbacks, none of the code I worked on used promises, and
people seemed to kinda hate them anyway. But then they were added to es6
and became really popular in the client-side crowd. At work, promises have
found their way into a number of smaller side projects. They're kind of
inescapable.

As someone comfortable with callbacks and
[with the async library](https://github.com/caolan/async), my concerns quickly
went towards wanting to take problems I knew how to solve with the async
library and porting them to promise land.

So, I did some exploration, and here are the results:

## The Basics

I'm going to skip a shit-ton of detail here. If you want to know more about
es6 promises in general,
[scope this article out.](http://www.html5rocks.com/en/tutorials/es6/promises/)

Anyways: Suppose there's an async action where a value `x` gets doubled,
asynchronously. It's not a realistic example but it's easy for demonstration
purposes.

As a node-style callback, we can write an implementation like this:

    double.asCallback = function(x, callback) {
      process.nextTick(function() {
        callback(null, x * 2);
      });
    };

With promises it's more or less the same:

    double.asPromise = function(x) {
      return new Promise(function(resolve, reject) {
        process.nextTick(function() {
          resolve(x * 2);
        });
      });
    };

In node, the callback's first argument is always an error if any, and the
second argument is the result. With promises, you have separate callbacks and
errbacks, and there's a returned Thing which wraps the async action.

(I think it's funny that the promise version of this function involved more
indentation than the vanilla callback version. CHECKMATE PROMISE FANS)

Note that the use of `process.nextTick` here is more a matter of notation than
necessity. In the case of the promise, it can wrap sync actions as well as
async actions without change in behavior, so protecting against zalgo is
unnecessary.

Calling them is also similar:

    // callback result: 4
    double.asCallback(2, function(err, result) {
      if (err) throw err;
      console.log('callback result: %d', result);
    });
     
    // promise result: 4
    double.asPromise(2).then(function(result) {
      console.log('promise result: %d', result);
    })
    .catch(function(err) { throw err; });

## Waterfall

Almost every blog post about promises throws down this use case, both to
demo promises and to argue their superiority. It's also by far the simplest
use case.

In these examples, suppose there's another async action which, instead of
doubling a value, adds 1 to it.

In vanilla javascript, it looks like this:

    // vanilla result: 5
    double.asCallback(2, function(err, intermediate) {
      if (err) throw err;
      plusOne.asCallback(intermediate, function(err, result) {
        if (err) throw err;
        console.log('vanilla result: %d', result);
      });
    });

If you're wondering how to avoid a christmas tree,
[read this](http://callbackhell.com/). It's really not as big a deal as people
make it out to be.

Even though it's pretty much trivial, async does come with a helper:

    // async result: 5
    async.waterfall([
      function(callback) {
        double.asCallback(2, callback);
      },
      plusOne.asCallback
    ], function(err, result) {
      if (err) throw err;
      console.log('async result: %d', result);
    });

Many people prefer this approach for avoiding christmas trees, though compared
to named functions I consider it a wash.

In promise land, it's also pretty straightforward:

    // promise result: 5
    double.asPromise(2)
      .then(plusOne.asPromise)
      .then(function(result) {
        console.log('promise result: %d', result);
      })
      .catch(function(err) {
        throw err;
      })
    ;

The chief difference among these is really in error handling. In these
examples, I'm throwing errors immediately since this is how `async.waterfall`
works. Unlike in `waterfall`, both vanilla callbacks and promises allow for
more complex error handling by intercepting them at different points of the
stack. The promise sugar for this is -heh- pretty sweet, and is generally
what promise apologists point to.

I won't get too far into error handling in promises, except to say that, while
I appreciate the approach, I don't actually find callback-based error handling
all that difficult.

## Mapping

One of the more common tasks I run into is "mapping" over an array of values,
concurrently. This is where things actually start to pick up, and inline
vanilla implementations become non-trivial:

    // vanilla result: [2,4,6]
    vanilla(xs, function(err, result) {
      if (err) throw err;
      console.log('vanilla result: %j', result);
    });
    function vanilla(xs, callback) {
      var latch = xs.length;
      var ys = [];
      var err;

      xs.forEach(function(x, i) {
        double.asCallback(x, function(_err, result) {
          if (_err && !err) {
            err = _err;
            callback(err);
          }

          latch--;
          ys[i] = result;

          if (!latch && !err) {
            callback(null, ys);
          }
        });
      });
    }

To summarize: First, figure out how many "things" you're doing concurrently.
Then, fire them all off with individual callbacks. In these callbacks, collect
the results, keep count of how many of the callbacks have fired, and if they've
all gone off then send the results to the final callback.

Error handling gets a little awkward here: Generally, the error sent up the
stack is the first one to happen. In this case, you also have to keep track
of whether an error has happened in this callback, whether an error has
happened previously, AND whether the final callback has been summoned or not.
It's non-trivial bookkeeping, and easy to get wrong.

Using `async.map` clears this up pretty quick:

    // async result: [2,4,6]
    async.map(xs, double.asCallback, function(err, result) {
      if (err) throw err;
      console.log('async result: %j', result);
    });

Promises, as shipped with es6, come with their own helper for executing an
array of promises called `all` (it comes with one other called `race`, but
as far as I can tell it's generally considered useless):

    // promise result: [2,4,6]
    Promise
      .all(xs.map(double.asPromise))
      .then(function(result) {
        console.log('promise result: %j', result);
      })
    ;

Because promises are objects, they can be passed around and operated on
synchronously. My promise-returning function, as well as functions which
*operate* on promises, can be used with old friends `Array#map`,
`Array#forEach` and `Array#reduce`. Which, when combined with `all`, is
actually pretty powerful.

## Rate-limited concurrency

One of the functions I use the most out of `async` is `async.eachLimit`.
This function takes an array of arguments and an "iterator" function, similar
to `async.map`. However, the *tricky* bit is that it also takes a number which
limits the number of tasks going on at any given time. This is really useful
for things like making current http requests since hammering services is rude.

It might look something like this:

    var numberAtATime = 5;
    async.eachLimit(bigArrayOfUrls, numberAtATime, function(someUrl, callback) {
      request(someUrl, function(err, res, body) {
        if (err) {
          callback(err);
        }
        if (res.statusCode !== 200) {
          callback(new Error(someUrl + ': status ' + res.statusCode));
        }

        doSomethingWithTheBody(body);

        callback(null);
      });
    }, function(err) {
      if (err) throw err;
      // did doSomethingWithTheBody for every body
    });

As you might guess, implementing this pattern manually is non-trivial, and you
generally shouldn't be expected to whip it up on the spot.
[The implementation in async](https://github.com/caolan/async/blob/master/lib/async.js#L169-L213)
is about 50 lines long, and is basically a more complicated version of the
latch code used earlier which uses recursion to maintain concurrency.

Promises, in and of themselves, don't really solve this problem. *In es6 there
aren't any helpers for this.* However, bluebird ships with a number of async
helpers targeting promises,
[some of which ship concurrency limits](https://github.com/petkaantonov/bluebird/blob/master/API.md#mapfunction-mapper--object-options---promise).

I won't lie, with all the hype I was a little disappointed.

## Lessons

1. Christmas trees are still a red herring.
2. Okay, the error handling stuff in promises *is* kind of cool.
3. Complex async patterns are complex regardless of whether vanilla callbacks
   or promises are used, so you'd better be able to find a library for that.

Gist of executable code chunks
[here](https://gist.github.com/jesusabdullah/3be10c1dc66859f45d8c).
