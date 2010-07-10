---
layout: post
title: Josh the IT Professional
---

The Monday after I got back from my lil' vacation, my mom called me, telling me that her work computer wouldn't post, Dad's computer wouldn't connect to the internet, my sister's computer wouldn't connect to the internet, and that she couldn't access the router. My parents run a small business, so not having a computer was an emergency for them, and I'm basically The Panco IT Guy right now, so I agreed to make a \*cough\* business trip to help them out.

Today, Thursday afternoon, I finally arrived and began to check out the situation for myself. The main work computer was taken to an IT shop the next town over since I'm really in no position to do hardware diagnosis, especially at the "it doesn't turn on" level, so I didn't have to worry about that.

The router issues were minor and were fixed in about five minutes. The issue with my sister's computer has to do with the wires not being physically connected (that's a whole nother story), but Dad's computer? Oh, man. This I gotta share.

## Dr. Jeuss Abdullah and the Case of Porno.com

Here's how I think it went down.

My parents recently went on vacation, and convinced my grandmother to watch the house. My grandma brought her own laptop, but due to wireless connectivity issues (since easily fixed), she used Dad's computer to check her email while my parents were gone.

So: She goes to the computer, and clicks "inbox" on the web-based email that my mother left open on the computer with the express directions *not* to navigate away from. But alas, an email's subject exclaims, "YOUR COMPUTER MAY NOT BE SECURE!" and offers a link to a so-called virus scanner.

My grandmother, being a willfully ignorant senior citizen internet user, jumps at the opportunity to <s>fuck up our shit</s> keep those viruses at bay.

the so-called virus scanner goes to work quickly. It rootkits itself into the MBR, the networking stack, numerous basic startup programs, and even AVG antivirus (disabling it). Trying to do anything, and I mean *anything* (You seriously can't conceive the extent at which "anything" goes), and popups exclaiming, "YOUR FILES ARE CURCPTED SCAN YOUR FILES WITH SOME JAVASCRIPTS IN THE INTERNET EXPLODER" and actually *opening* Internet Explorer reveals the second or third most amazing web site I have ever seen: "PORNO.COM":

![](http://farm5.static.flickr.com/4098/4776109583_e46b83ce44.jpg)

([flickr](http://www.flickr.com/photos/jesusabdullah/4776109583/)--thanks Mom!)

So, after making a half-assed attempt at saving Dad's music files (it was pretty hopeless), I nuked the crap out of the hard drive and started the long, laborious process of starting from scratch with Windows XP Pro. Man I wish I was installing some kind of linux.

## Oh, the network wiring situation

Here's the low-down:  My dad decided *not* to consult me when writing specs for laying the network wiring in our house. Even worse, the workers following the specs while building our house addition didn't properly follow the specs.  So, here's what would be ideal: Seven ethernet cables, each starting in the home office walk-in closet, and one each ending in the home office computer desk, each of the three bedrooms, two in the work office, and one in the upstairs apartment. In addition, a hollow pipe and extra cables would be ran to allow for extra wires to be ran through the slab of our garage, and phone cables would be ran side-by-side.

Here's what actually happened:

* One cable ran from our home office into the upstairs boiler room.

* One cable ran from our upstairs boiler room to the upstairs apartment.

* No phone cable. That's right, the ethernet cable was being used *as* the phone cable.

* No pipe for running more cable later.

After lots of kludging, finagling and some history I won't bore you with, here's the current situation:

* One cable running from the work office (which luckily had a phone jack) to the upstairs boiler room

* One cable running from the upstairs boiler room to the apartment

* One cable running from the upstairs boiler room to the home office

* One router to rule them all

Yeah.

It mostly works, except for the computer in the home office. and the one in the apartment. Because there's only one cable running from the downstairs to the upstairs and no second router, we have to choose one or the other, and when my brother was staying in the apartment, he not only decided that his laptop's connectivity was more important than my sister's computer connectivity in the home office, but also that he wasn't obligated to keep the rest of us in the loop.

I may or may not have a fix. Well, kind of a fix.  The wires upstairs are connected with a phone-cable wireboard.  So, I connected both the "client" wires to the one "server" wire. I'm hoping I can make it work for cases where only one computer is on the LAN. Of course, such a mess of wires, running from one side of the house to the other and then BACK again (and this house is massive, make no mistake) is going to be pretty tempermental. FFFFFFFF--

Wish me luck.
