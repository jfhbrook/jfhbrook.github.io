---
layout: post
title: Elegance vs. Getting Shit Done
---

Today is my first day back to work since I left for SciPy 2010, and, well, today has been as slow a day as any. I got some work done on my thesis, but not as much as I would like.

Part of the problem, of course, is merely distractions. I signed up for the scipy mailing list triple threat last week, and I **can't stop answering emails** oh god help me o__o

I think the overarching problem, though, is this problem I have with trying to balance a desire for doing things "right" and doing things quickly. When it comes to software in engineering, it's mostly a means to an end, and not an end unto itself (to wax cliche'd). That is, nobody really cares about the particular implementation of my simulation, or how kludgy it is as long as the results are valid. On the other hand, it's generally considered a good idea to not just Get An Answer in programming, but also get the answer in a *good way* that makes it easy to, say, get the answer faster, harder, or to even work on a different but similar problem. That is, software should be maintainable.

For my thesis, I'm supposed to be running some parameterized models of a needle probe heating and cooling in snow. The problem is, the current software I'm using to run my models ([COMSOL](http://www.comsol.com/) in concert with MATLAB) isn't so hot when it comes to making scriptable models, due to its primary focus on GUI interaction and its spats with The Mathworks regarding patent infringement.

On the other hand, it's a proven solution, unlike some of the alternate tools I would like to look at. For example, I wouldn't mind using CAD --> MeshPy --> sfepy --> Mayavi for my geometry --> mesh --> solve --> draw workflow. However, I would have to work through all these tools by myself, without my advisor's knowledge of COMSOL, abandoning the work I've already done to get it to work. Moreover, COMSOL is an all-in-one solution, whereas in the open source world, each part of the workflow has been "dealt with" separately.

I believe that using alternate tools, once I find the right ones, learn how to use them, and get them to work together, would leave me with a system desireable to the one I would have using COMSOL and MATLAB. However, the COMSOL/MATLAB model is almost done, and I probably won't have to fundamentally change it again. Even if I do, the problem is simple enough that I could honestly redo it within a week if need be. It's simple enough stuff! Yet, it's frustratingly clunky.

I think this is a fault of mine--that is, I think my concern about having Good Code (or whatever) is undue for something like this, and it really slows me down. It's a virtue of course, but sometimes quick and dirty is the best approach.

Bummer.
