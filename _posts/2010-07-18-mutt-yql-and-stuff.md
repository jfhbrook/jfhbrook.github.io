---
layout: post
title: YQL, Mutt and Whatever I Feel Like Typing About
---

Nothing has happened lately that I want to write a whole blog post about, but there are a few small things I feel like touching on.

## Dawkins

I got to see Richard Dawkins at my university the other day! Here are some things:

* [The News-Miner's coverage](http://www.newsminer.com/view/full_story/8782758/article-Dawkins-speaks-to-overflow-Fairbanks-audience-about-humans--religion?instance=local_news)
* [A self-reddit by yours truly that should've been a blog post](http://www.reddit.com/r/atheism/comments/cq6ja/richard_dawkins_just_gave_a_talk_at_my_university/)

## Dog

The ole' family dog, my hairy sister from another mother, Anja, has terminal cancer. Hard to believe! Apparently it's a very aggressive type of cancer. The vet removed a massive tumor from her spleen, and while there weren't signs of other cancer, it's exceedingly likely that there are microtumors somewhere inside her. She has 2-6 months left.

It's weird. I mean, the other dogs I've had die on me over the years did so either due to traffic accidents, or pretty much without warning one day:

* Billy got in a tragic car accident. I won't get into that.
* Barley was supposed to die "any day now" for like four years. We waited so long for what should've been inevitable that we were shocked when the prophecies finally came true.
* Ted had a heart attack one day and died completely without warning.

Anja, on the other hand? I have a two-month warning. That's really weird. She's still alive and doing well at the moment, but I also know her time is very short.

I'm going to miss her.

## YQL and Unicode in lulzbot's new !wx function

Still hacking on lulzbot! It's still a piece of crap! But it was a basic weather function now, which is cool! It's powered by [YQL](http://developer.yahoo.com/yql/). In particular, it pulls data from queries like this:

    select * from weather.woeid where w in (select woeid from geo.places where text="Fairbanks, AK" limit 1)

[Try it here!](http://yhoo.it/dlRkZs)

Honestly, YQL strikes me as a little weird. But, it works, and I was able to scramble that bit up there together really easily to make a query that easily grabs me exactly what I want with a pretty general query! What's more, I'm using [this nifty library](http://github.com/drgath/node-yql) at the recommendation of someone from #node.js, which makes it REAL easy. I'm really glad I got to avoid trying to probe NOAA's APIs. Thanks, recommender!

Also neat is that I'm using unicode for the output of the bot. So, for example:

    19:19 < jesusabdroolah> !wx 99775
    19:19 < lulzbot> Fairbanks, AK:
    19:19 < lulzbot> Now: ☁☁☁(Cloudy), 68 (F)
    19:19 < lulzbot> Today: ☔(Showers), 67/55 (F)
    19:19 < lulzbot> Tomorrow: ☔(Showers), 65/54 (F)

(The weird squiggles that are getting eaten somewhere between my markdown and your html are [clouds](http://www.fileformat.info/info/unicode/char/2601/index.htm) and [umbrellas](http://www.fileformat.info/info/unicode/char/2614/index.htm). I also use a [sun](http://www.fileformat.info/info/unicode/char/263c/index.htm) for better weather. Things have been dreary here lately!)

# Mutt

Yesterday, I forgot to write about Mutt!  I don't normally use it, but the other day I learned that, using it, you can fire off emails with a single command! This makes emailing files to myself over SSH way easier. So, now, instead of *ssh -XY* and using firefox/gmail, I can do this:

    echo "File attached." | mutt -s'That stupid file' -a file.m josh.holbrook@gmail.com

And less than two seconds later, *bam* in my inbox! It's pretty awesome that I can do this, imo. :D

