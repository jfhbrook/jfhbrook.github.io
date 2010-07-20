---
layout: post
title: "Sylvester-common: Or, simple matrix maths in node.js"
---

As you probably know, I've been sipping on the [node.js](http://nodejs.org) kool-aid lately. Mostly, I've just been hanging out in the [channel](irc://irc.freenode.net/#node.js) and playing with [my bot](http://github.com/jesusabdullah/lulzbot).

However, my previous background is in middleweight scientific computing: Think [Excel](http://en.wikipedia.org/wiki/Microsoft_Excel), [Matlab](http://en.wikipedia.org/wiki/MATLAB) and more recently [Scipy](http://scipy.org). So, coming to an environment whose focus is on webserving is pretty different for me--cool, but different. And, to be honest, I was jonesin' for some matrices.

I did some cursory [web searches](http://duckduckgo.com) before and didn't find anything, but after poking at the problem myself and finding it surprisingly difficult (I mean, I can do it by hand easily enough right?), I searched with *more scrutiny* and eventually found...

##[This!](http://sylvester.jcoglan.com/)

Pretty cool, right? Of course, it was aimed at being a client-side library, and not a commonjs module. But, that was easy enough to fix! So, I cloned [the repo](http://github.com/jcoglan/sylvester) and made a few changes. This is my first experience successfully porting something, but this was a particularly easy case due to not requiring anything from the DOM.

First, if you read [the Rakefile](http://github.com/jcoglan/sylvester/blob/master/Rakefile) (or bumble through it like I did, if you don't know Ruby), you'll see that under the "build" rule, it takes the lists inside "packages," grabs all the files in src/ with that name, and concats/minifies them into a file. So, I just added a second rule:

    #snipped from the Rakefile
    PACKAGES = {
      'sylvester'   => %w(vector matrix line line.segment plane polygon polygon.vertex linkedlist),
      'sylvester-common'   => %w(vector matrix line line.segment plane polygon polygon.vertex linkedlist common)
    }

and added a javascript file that would add the commonjs exports:

    //common.js
    module.exports = {$V: $V,
                      $M: $M,
                      $L: $L,
                      $P: $P};

Then, I mashed "rake" and had an extra file, "sylvester-common.js," which could be imported in Node!:

    node> var m = require('./sylvester-common');
    node> var a= m.$M([[1,2],[3,4]]);
    node> var x=m.$V([1,1]);
    node> a.multiply(x)
    [3, 7]

Pretty sweet, right? I mean, that's a trivial example, but it shows that it works, and if you check out the [docs](http://sylvester.jcoglan.com/docs) you can see that the basics are covered pretty well.

The only downside (and really it's a two-sided coin) is that this is a pure javascript library. On the plus side, that means the un-common version will work in the browser great! (Anybody else seeing some mapreduce potential using [dnode](http://github.com/substack/dnode) here?) On the minus side, there's no way it could go toe-to-toe, performance-wise, with any "real man's" library, making use of optimized c/c++/fortran codes such as lapack, BLAS, atlas, etc., like numpy does.

In other words: ymmv.

If you want to try it out, my repo's [here](http://github.com/jesusabdullah/sylvester). For convenience's sake, I git added the built libs. Enjoy!
