---
layout: post
title: Is node done?
---

Some of you may have seen [this post](https://gitlab.com/ev/evbogue/blob/master/content/nodeisdone.md) by [Ev Bogue](http://evbogue.com), which has been going around the IRCs lately.

(Yes I know it's pretty old. If you look at the commit history, it was last touched November 13th. Oddly enough, it appears missing from The Blog. And this is the first I've seen of it. So whatever.)

It's a bit of a bummer reading it, because even though it's very ranty and doesn't really make its points clearly, there's totally a glimmer of truth in there. I feel like this could have been *really good* if it went through 3 or 4 rewrites and a significant decrease in ire. Since I'm *currently unemployed* I have tons of time to write blog posts, so I figure: Why not take a closer look?

## Preliminaries

First of all: I don't know Ev Bogue. In real life, he could be a cool dude. Or, he could be just as ranty in person as he is in this post. I honestly don't know. Keep in mind, this isn't really anything personal against the dude.

Second: There are a number of digressions from OP that should be addressed separately as they distract from the Main Point (as it were):

1. Github. A worthy discussion, but doesn't have much to do with node. Lots of people use github.
2. Choice of computer. Not that there's any real argument from OP as to why one shouldn't use a mac. But it doesn't have a whole lot to do with node, especially considering that many noders **do** use linux, and even Windows sometimes. But I digress.
3. Probably things I forgot.

Finally: I wrote this over an evening. I don't fuss too much over polishing my blog posts. Which makes me kind of a hypocrite.

## What *is* node, anyway?

The most coherent claim made here is that node's "just a webserver." Is this true?

Yeah, kind of.

I mean, node's no nginx. Unlike nginx configs, javascript is turing-complete and node's require system means you can pull in *all kinds* of stuff. With, say, nginx, if you want to add functionality you have to write a plugin in C, and then compile it in. Which you can do of course, but it's not like nginx was really designed to write webapps on top of, excepting for its ability to use CGI/fastCGI/mod_{whatever}/proxying/whatever.

Perhaps a better comparison would be made between node and [werkzeug](http://werkzeug.pocoo.org/). Now, I haven't used werkzeug, but I think it's pretty obvious that there are parallels between node's lower-level http/IO APIs and werkzeug's lower-level APIs for writing WSGI applications. And, like javascript/node_modules, python is turing-complete and has a reasonable module system.

Now one *might* say, "but Josh, node has file IO and sockets and a whole bunch of other stuff! Surely it's no mere Web Server!" And that's true. But here's an anecdote that might make you reconsider the ramifications of this.

One of the few node conference-ish things I got to attend was Node Summercamp back in, like, 2011. Back then, Ryan was still pretty involved, and since I was in SubStack's entourage at the time I got to talk to Ryan quite a bit anyway. So I'm chillin' with a group of people at Node Summercamp and Ryan says something along the lines of, "node is for building webservers." Pretty straightforward, right? And pretty much what Ev Bogue was saying.

So what *I* say is, "I like to think that node's good for juggling *all kinds* of IO."

"That's incidental," he says.

So, straight from the creator: Node is for writing webservers, and the fact that node can do files and stdio is, at best, to enable writing webservers.

(Hopefully Ryan remembers this conversation too. It could be pretty embarrasing if I was accidentally words in his mouth!)

Additionally: Just watch Ryan talk about node in the year or so before he went splitsville. You can tell he's getting bored of explaining something that, to him is obvious: evented IO? v8? Yeah totally. **Now kiss!** Neither evented IO or javascript in-and-of-themselves were truly revolutionary, nor was server-side javascript in particular. They just happened to make a good fit!

Keep all this in mind, as I'm going to come back to it multiple times.

## Node is Done?

Given that node is for writing webservers and that you can write webservers Pretty Well right now, *is* node "done?" *Yeah, pretty much.* Many a time have I heard these sentiments from the core team ("we're going to hit 1.0 pretty soon"), and in following the development of node you can see most APIs are becoming "stable/frozen" and that fewer of them are being added on for each even-semver version. None of this should be really surprising.

## Is this *bad*?

Generally: Not Really. Would you say that people should ditch python because WSGI is done? Probably not. Similarly, node itself is less important than the language (javascript), the technology (evented IO), and the ecosystem (tons of modules). Node does pretty well in this regard. And, even if node dies off (it may or may not), we will certainly learn lessons from it. To quote a close friend, "you can't kill an idea."

One case where node's done-ness could get awkward is when es6 rolls out. I say this because there are a number of new features in es6 (es6 modules, native stream types, generators, probably others) that node's going to have to deal with. Are they going to adopt them? Are they going to sunset the APIs that node built prior to es6? Or are they going to ignore them? Either way, how will people feel about it?

We'll see.

## Userspace?

Aside from ignoring taste (I use modules from a *number* of authors), is it safe to say that userspace is "done" because it caught up with "everyone else" in that there are modules to do most things people are doing across most modern software ecosystems?

I don't think it really follows that "catching up" implies finality when it comes to the userspace ecosystem. There's always more software to write, and people tend to choose tools that they like and which can reasonably solve their problem. This forms a continuum: Things that pair `(js || ruby || python)` to asynchronous io are on one end, and cobol is on the other (`(java || php || perl)` and mod_whatever being somewhere in between). As long as node remains a useful tool (and yes, even being able to "configure webservers" is useful), smart people will be writing stuff on top of it. That will still be progress. It will decline over time and become "the next php" someday, but I figure it still has at least a *few* years left.

## Ramifications

One point that Ev touches on which I think is *actually really important* is that---recognizing that node solves only certain problems better and *will* eventually be considered "old and busted"---we should prepare for that fate.

In what is probably an odd distinction, node happens to be one of the first platforms for writing web stuff that I learned seriously. Unlike others, I didn't come "from rails" or "the client." Prior to node, I was writing scientific scripts that read in a flat file, did some math and dumped another flat file. So I haven't had to deal with this sort of thing before. Perhaps there are others like me in the node community, and certainly any career programmer deals with it at *some* point. So I don't have any hindsight on this. At all.

I do have a plan for surviving the time where everyone moves on. I figure I just need to diversify my skills on whatever off-time I can find. Right now, I *am* in fact trying to learn c and I suspect Ev is giving good advice here. c/c++ are what almost everything else is built on, create really fast executables, and are harder to write, which probably means that finding web devs with solid c skills is really handy. I'd also thin older-but-still-popular web platforms (php) are safer because their staying power is better known.

Node is done. But that's okay.
